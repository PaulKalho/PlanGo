from email import message
from wsgiref import headers
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, renderer_classes
from .models import Credentials
from .ResponseException import ResponseException
from marshmallow import Schema, fields

# Parse Transaction Class:
from .ParseTransactions import ParseTransaction
from cashapp.models import FixAusgaben, FixIncome, TransactionGroupIntermediate

import requests
import datetime
import os
import uuid
import hashlib

# def getTokens():
#     #Hier sollen die access und refresh tokens von nordigen abgefragt werden

# Helper Functions:

def getAttr(transaction, attr):
    """
        This function is a workaround for getting attributes from the transaction.
        Has to be there because not every transaction from different banks has the same attributes

        :param transaction: The transaction to get attr from
        :param attr: attribute to search from

        :return: The value of the attribute
    """
    if(transaction.get(attr) != None):
        if(attr == "creditorAccount" or attr == "debtorAccount"):
            return transaction.get(attr).get("iban")
        return transaction.get(attr)
    return None

def parseTransactions(transactions):
    """
        This function parses the Function to an json-array for the frontend and analyses it (isGroup, isTransaction)
        :param transaction: raw transaction data from nordigen

        :return: A jsonifyed Transaction List
    """
    final = []

    #This class as well as schema is used to json-"serialize", the data we get from the request and make it to a json-Array
    #See the marshmallow-dependency documentation
    class TransactionSchema(Schema):
        uoi = fields.Str()
        date = fields.Date() 
        creditor = fields.Str()
        debitor = fields.Str()
        value = fields.Decimal() 
        creditorIban = fields.Str()
        debtorIban = fields.Str()
        isFixOutcome = fields.Bool()
        isFixIncome = fields.Bool()
        group = fields.Str()
        
    schema = TransactionSchema()
    
    # TODO: I only work with booked transactions
    booked = transactions["transactions"]["booked"]

    for transaction in booked:
        
        dateTransaction = datetime.datetime.strptime(transaction.get("bookingDate"), "%Y-%m-%d").date()
        
        #############################################################################################

        # Create uuid identifier:
        # Der seed sollte aus allen attributen von transaction erstellt werden, nicht nur einige
        # Uid wird hergestellt aus: Datum, Amount, creditorName, debitorName
        string_seed = generateSeed(transaction)
        m = hashlib.md5()
        m.update(string_seed.encode('utf-8'))
        uuid_te = uuid.UUID(m.hexdigest())

        ###########################################################################################

        # Now check if Transaction is a fix transaction or not:
        fixOutcome = False
        fixIncome = False
        isOutOrInOrNone = checkFixTransactions(transaction)
        if(isOutOrInOrNone == "fixOutcome"):
            fixOutcome = True
        elif(isOutOrInOrNone == "fixIncome"):
            fixIncome = True
        
        ###########################################################################################

        # Check if transaction has been grouped already
        group = checkGroupTransaction(uuid_te)

        ###########################################################################################
        
        # Now parse Transaction to json and add to final-Array
        obj = ParseTransaction(
                uuid_te,
                dateTransaction,
                getAttr(transaction, "creditorName"),
                getAttr(transaction, "debtorName"),
                transaction.get("transactionAmount").get("amount"), 
                getAttr(transaction, "creditorAccount"), 
                getAttr(transaction, "debtorAccount"), 
                fixOutcome, 
                fixIncome, 
                group
            )
        result = schema.dump(obj.__dict__)
        final.append(result)

    return final

def generateSeed(transaction):
    """
    This function generates a seed, used to creat uoi for a transaction
    :param transaction: The raw transaction data from NordigenAPI

    :return: string seed
    """
    seed = ""
    for attribute in transaction:
        if(isinstance(transaction.get(attribute), str)):
            seed += transaction.get(attribute)
    return seed

def checkGroupTransaction(uuid):
    """
    This function checks if the uuid is in TransactionGroupIntermediate Table
    :param uuid: The generate uuid of a transaction
    
    :return: The name of the group which was found OR None
    """

    # TODO: Filter groupIntermediate by user id
    groupIntermediate = TransactionGroupIntermediate.objects.all()
    group = None
    for obj in groupIntermediate:
        transaction_id = obj.transaction_id

        if(str(transaction_id) == str(uuid)):
            group = obj.group.name
            break

    return group

def checkFixTransactions(transaction):
    """
    Checks if transaction is in database fixOut-/Income Table
    :param transaction: The raw transaction Data from NordigenAPI

    :return: string "fixOutcome" OR "fixIncome" which is passed to the frontend later (with the jsonyfied transaction)
    """
    fixOutcome = FixAusgaben.objects.all()
    fixIncome = FixIncome.objects.all()

    OutOrIncome = None

    for obj in fixOutcome:
        # Hier die Logik wie transaktionen prüfen ob fixOutcome 
        if(
        obj.creditor_iban == getAttr(transaction, "creditorAccount")
        and obj.debtor_iban ==  getAttr(transaction, "debtorAccount")
        and obj.creditorName == getAttr(transaction, "creditorName")
        and obj.debtorName == getAttr(transaction, "debtorName")
        and float(transaction.get("transactionAmount").get("amount")) < 0
        ):
            OutOrIncome = "fixOutcome"
            break

    for obj in fixIncome:
        # Hier wird geprüft ob transaktion is fixIncome
        if(
        obj.creditor_iban == getAttr(transaction, "creditorAccount")
        and obj.debtor_iban ==  getAttr(transaction, "debtorAccount")
        and obj.creditorName == getAttr(transaction, "creditorName")
        and obj.debtorName == getAttr(transaction, "debtorName")
        and float(transaction.get("transactionAmount").get("amount")) > 0
        ):
            OutOrIncome = "fixIncome"
            break
    
    return OutOrIncome


# API FUNCTIONS:

@api_view(('GET',))
def get_bank(request):
        """
        This function gets the Bank from NordigenAPI.
        Also: It sets the access_token for all NordigenAPI Requests
        :param request: The sent request

        :return: The response of all Banks
        """
        response = Response()

        dataS = {
            "secret_id": os.environ.get("NORDIGEN_SECRET_ID"),
            "secret_key": os.environ.get("NORDIGEN_SECRET_KEY")
        }

        #Make request tokens
        r = requests.post("https://ob.nordigen.com/api/v2/token/new/" , data=dataS)
        r_status = r.status_code

        #Handle token response
        if r_status == 200:
            #This Data holds the access as well as the refresh tokens
            data = r.json()

            #Set accesstoken as session variable
            request.session['access_token'] = data["access"]

            #Now use them to get banks
            headers = {
                "Authorization": "Bearer " + data["access"] 
            }

            #Make request Banks
            r = requests.get("https://ob.nordigen.com/api/v2/institutions/?country=de", headers=headers)
            r_status = r.status_code
            
            if r_status == 200:
                content = r.json()
                response = Response(data=content, status=status.HTTP_200_OK)
            else:
                raise ResponseException(status_code=r_status)
        else:
            raise ResponseException(status_code=r_status)
    
        return response

@api_view(('POST',))
def get_link(request):
    """
    This function gets the link from the NordigenAPI so that the user can log in
    :param request: The sent request

    :return response: The response = contains the link
    """
    response = Response()

    #Headers auth headers (access token)
    headers = {
        "Authorization": "Bearer " + request.session['access_token']
    }

    #Data to send
    #TODO: User mitsenden hier her ans frontend
    payload = {
        "redirect": os.environ.get("REDIRECT_URI"),
        "institution_id": request.data["institution_id"],
    }

    #Make request tokens
    r = requests.post("https://ob.nordigen.com/api/v2/requisitions/" , data=payload, headers=headers)
    r_status = r.status_code

    #Handle token response
    if r_status == 201:
        #This Data holds the access as well as the refresh tokens
        data = r.json()

        #Save id from requisitions in DB, we need it to get the accounts in list_accounts()
        model = Credentials()
        model.user = request.user
        model.institution = data["id"]
        model.save()


        content = data["link"], 
        response = Response(data = content, status=status.HTTP_200_OK)
    else:
        raise ResponseException(status_code=r_status)
        
    return response

@api_view(('POST',))
def list_accounts(request):
    """
    This function gets all accounts the user has in NordigenAPI. It safes the account array to the Database
    :param request: The request from the frontend
    
    :return response: The amount of accounts the user has.
    """
    
    access_token = request.session['access_token']
    response = Response()

    #Headers auth headers (access token)
    headers = {
        "Authorization": "Bearer " + access_token
    }

    #Get id from db
    user = request.user
    row = Credentials.objects.get(user=user)
    id = row.institution
    

    #Get Accounts
    url = "https://ob.nordigen.com/api/v2/requisitions/" + id + "/"

    r = requests.get(url, headers=headers)
    r_status = r.status_code

    #Handle response
    if r_status == 200:
        #This Data holds the accounts
        data = r.json()
        #Add accounts array to DB
        row.accounts = data["accounts"]
        row.save()

        content = len(data["accounts"])
        response = Response(data=content, status=status.HTTP_200_OK)
    else:
        raise ResponseException(status_code=r_status)

    return response

@api_view(('POST',))
def list_transactions(request):
    """
    This is the final function in the workflow. It gets all transactions from Nordigen
    passes them to parseTransactions() and then returns. 
    :param request: Contains the id for the account requested

    :return: Returns the jsonifyed transaction array
    """
    access_token = request.session['access_token']
    response = Response()

    #Headers auth headers (access token)
    headers = {
        "Authorization": "Bearer " + access_token
    }

    #Now get accounts-id from DB with id (pos in array)
        #First get the id and user from the request
        #Get row from model
        #get account-id
    id = request.data["id"]
    user = request.user


    row = Credentials.objects.get(user=user)
    accounts = row.accounts

    account_id = accounts[id]

    ##

    url = "https://ob.nordigen.com/api/v2/accounts/" + account_id + "/transactions/"
    r = requests.get(url, headers=headers)
    r_status = r.status_code

    if r_status == 200:
        content = r.json()
        #Parse Response(transaction) and only give important info back to frontend
        content = parseTransactions(content) # This is a json array: [{},{},{}]

        response = Response(data=content, status=status.HTTP_200_OK)
    else:
        raise ResponseException(status_code=r_status)

    return response

@api_view(('GET', ))
def check_accounts(request):
    """
    This function checks if the user already has a accounts. Its called from the dashboard in the frontend.
    It returns the amount of accounts the user has
    :param request: The request contains = id, the accountarray-id and user-requested user

    :response amount of accounts the user has
    """
    # TODO raise exception wenn user not found
    access_token = request.session["access_token"]
    response = Response()

    headers = {
        "Authorization": "Bearer " + access_token
    }

    #Get id from db
    user = request.user
    row = Credentials.objects.get(user=user)
    id = row.institution

    #Get Accounts
    url = "https://ob.nordigen.com/api/v2/requisitions/" + id + "/"

    r = requests.get(url, headers=headers)
    r_status = r.status_code

    if r_status == 200:
        #This Data holds the accounts
        data = r.json()

        content = { "accounts": len(data["accounts"]) }
        response = Response(data=content, status=status.HTTP_200_OK)
    else:
        raise ResponseException(status_code=r_status)

    return response
    
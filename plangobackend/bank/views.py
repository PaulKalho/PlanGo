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
from cashapp.models import FixAusgaben, FixIncome

import requests
import datetime
import os
import uuid
import hashlib

# def getTokens():
#     #Hier sollen die access und refresh tokens von nordigen abgefragt werden

def parseTransactions(transactions):
    # @param transaction = raw transaction data from nordigen
    # Parse JSON and only transfere important Data

    final = [] # Used for Final JSON-Array


    #This class as well as schema is used to json-"serialize", the data we get from the request and make it to a json-Array
    #See the marshmallow-dependency documentation
    class TransactionSchema(Schema):
        uoi = fields.Str()
        date = fields.Date() 
        creditor = fields.Str()
        debitor = fields.Str()
        value = fields.Decimal()
        mandateId = fields.String()  
        creditorIban = fields.Str()
        debtorIban = fields.Str()
        isFixOutcome = fields.Bool()
        isFixIncome = fields.Bool()
        
    schema = TransactionSchema()
    
    # Only work with booked Data
    booked = transactions["transactions"]["booked"]

    for transaction in booked:
        #EVTL. statt madateID einfach IBAN nutzen, PROBLEM: Creditor and Debtor
        #Check if mandateId is empty, if yes, then object mandateId should stay empty
        dateTransaction = datetime.datetime.strptime(transaction.get("bookingDate"), "%Y-%m-%d").date()
        
        #Create uuid identifier
        # Uid wird hergestellt aus: Datum, Amount, creditorName, debitorName
        string_seed = transaction.get("bookingDate") + transaction.get("transactionAmount").get("amount") + transaction.get("creditorName") + transaction.get("debtorName")
        #UUID.nameUUIDFromBytes(aString.getBytes()).toString();
        # string_seed = {
        #     "date": transaction.get("bookingDate"),
        #     "amount": transaction.get("transactionAmount").get("amount"),
        #     "creditor": transaction.get("creditorName"),
        #     "debtor": transaction.get("debtorName")
        # }
        m = hashlib.md5()
        m.update(string_seed.encode('utf-8'))
        uuid_te = uuid.UUID(m.hexdigest())

        if transaction.get("mandateId") != None and transaction.get("mandateId") != "OFFLINE":
            mandateId = transaction.get("mandateId")
        else:
            mandateId = None

        # Call checkTransactions here with transaction.
        # Checks if Transaction is in fixIn or fixOutcome
        fixOutcome = False
        fixIncome = False
        isOutOrInOrNone = checkFixTransactions(transaction)
        if(isOutOrInOrNone == "fixOutcome"):
            fixOutcome = True
        elif(isOutOrInOrNone == "fixIncome"):
            fixIncome = True


        obj = ParseTransaction(uuid_te, dateTransaction, transaction.get("creditorName"), transaction.get("debtorName"), transaction.get("transactionAmount").get("amount"), mandateId, transaction.get("creditorAccount").get("iban"), transaction.get("debtorAccount").get("iban"), fixOutcome, fixIncome)
        result = schema.dump(obj.__dict__)

        final.append(result)

    return final

def checkFixTransactions(transaction):
    # This Function checks if @param transaction is in database fixOutcome. If yes @return True else @return False
    fixOutcome = FixAusgaben.objects.all()
    fixIncome = FixIncome.objects.all()

    OutOrIncome = None

    for obj in fixOutcome:
        # Hier die Logik wie transaktionen prüfen ob fixOutcome 
        if(
        obj.creditor_iban == transaction.get("creditorAccount").get("iban") 
        and obj.debtor_iban ==  transaction.get("debtorAccount").get("iban") 
        and obj.creditorName == transaction.get("creditorName")
        and obj.debtorName == transaction.get("debtorName")
        and float(transaction.get("transactionAmount").get("amount")) < 0
        ):
            OutOrIncome = "fixOutcome"
            break

    for obj in fixIncome:
        # Hier wird geprüft ob transaktion is fixIncome
        if(
        obj.creditor_iban == transaction.get("creditorAccount").get("iban") 
        and obj.debtor_iban ==  transaction.get("debtorAccount").get("iban") 
        and obj.creditorName == transaction.get("creditorName")
        and obj.debtorName == transaction.get("debtorName")
        and float(transaction.get("transactionAmount").get("amount")) > 0
        ):
            OutOrIncome = "fixIncome"
            break
    
    return OutOrIncome



@api_view(('GET',))
def get_bank(request):
        # results = self.request.query_params.get('type')
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
    # Es würde Sinn machen nun den account array per reference an einen user aus dem frontend zu binden
    # ID speichern oder reference
    # Anzahl der Accounts in account array zurückgeben?
        # Auswahl ermöglichen und dann die pos im backend ansprechen

    # Workflow:
    # Link wird ans frontend gesendet und ein/mehrere account werden geadded.
    # Die id aus get_link(requisiton_id) speichern im zsmhang mit request.user.
    # Dann get_accoutns im frontend ausführen, und den accounts array dem user zuordnen.
        # In get_accounts wird der accounts array dem user zugeordnet
        # Response ist die Anzahl der accounts
    # User startet dann immer in der view wo seine accounts aufgelistet werden
    # User kann account auswählen und gibt die Pos ans backend weiter (get_transactions)
    # In get_transactions wird dann die ausgewählte pos aus accounts array geholt und die request ausgeführt.
        # Response = Transactions Endpoint etc.

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

    #Handle token response
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
        # Hier muss nun die Logik angesetzt werden, um content nach Einträgen in cashapp.model.fixAusgaben zu filtern
        # Wenn diese gefunden werden, muss das dem frontend irgendwie mitgeteilt werden
        # function checkfixAusg(...), write in content (maybe as param)

        response = Response(data=content, status=status.HTTP_200_OK)
    else:
        raise ResponseException(status_code=r_status)

    return response

@api_view(('GET', ))
def check_accounts(request):
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
    
import requests
from rest_framework.response import Response
from rest_framework import status
from .ResponseException import ResponseException

from .models import Credentials
from cashapp.models import FixAusgaben, FixIncome, TransactionGroupIntermediate

from marshmallow import Schema, fields
from .ParseTransactions import ParseTransaction

from datetime import datetime
import os
import uuid
import hashlib

class Nordigen: 

    # Cunstructor 
    def __init__(self, secret_id, secret_key):
        self.secret_id = secret_id
        self.secret_key = secret_key
        self.apiKey = "",
        self.__generateApiKey()

    # Private Functions: 
    
    def __parseTransactions(self, transactions, user):
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
            
            dateTransaction = datetime.strptime(transaction.get("bookingDate"), "%Y-%m-%d").date()
            
            #############################################################################################

            # Create uuid identifier:
            # Der seed sollte aus allen attributen von transaction erstellt werden, nicht nur einige
            # Uid wird hergestellt aus: Datum, Amount, creditorName, debitorName
            string_seed = self.__generateSeed(transaction)
            m = hashlib.md5()
            m.update(string_seed.encode('utf-8'))
            uuid_te = uuid.UUID(m.hexdigest())

            ###########################################################################################

            # Now check if Transaction is a fix transaction or not:
            fixOutcome = False
            fixIncome = False
            isOutOrInOrNone = self.__checkFixTransactions(transaction, user)
            if(isOutOrInOrNone == "fixOutcome"):
                fixOutcome = True
            elif(isOutOrInOrNone == "fixIncome"):
                fixIncome = True
            
            ###########################################################################################

            # Check if transaction has been grouped already
            group = self.__checkGroupTransaction(uuid_te, user)

            ###########################################################################################
            
            # Now parse Transaction to json and add to final-Array
            obj = ParseTransaction(
                    uuid_te,
                    dateTransaction,
                    self.__getAttr(transaction, "creditorName"),
                    self.__getAttr(transaction, "debtorName"),
                    transaction.get("transactionAmount").get("amount"), 
                    self.__getAttr(transaction, "creditorAccount"), 
                    self.__getAttr(transaction, "debtorAccount"), 
                    fixOutcome, 
                    fixIncome, 
                    group
                )
            result = schema.dump(obj.__dict__)
            final.append(result)

        return final

    def __generateSeed(self, transaction):
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

    def __checkGroupTransaction(self, uuid, user):
        """
        This function checks if the uuid is in TransactionGroupIntermediate Table
        :param uuid: The generate uuid of a transaction
        :param user: The user which transactions should be grouped. 
        
        :return: The name of the group which was found OR None
        """

        groupIntermediate = TransactionGroupIntermediate.objects.all().filter(created_by_id = user)
        group = None
        for obj in groupIntermediate:
            transaction_id = obj.transaction_id

            if(str(transaction_id) == str(uuid)):
                group = obj.group.name
                break

        return group

    def __checkFixTransactions(self, transaction, user):
        """
        Checks if transaction is in database fixOut-/Income Table
        :param transaction: The raw transaction Data from NordigenAPI
        :param user: The user object of the user which transactions should be checked if fix or not

        :return: string "fixOutcome" OR "fixIncome" 
        """
        fixOutcome = FixAusgaben.objects.all().filter(created_by_id = user.id)
        fixIncome = FixIncome.objects.all().filter(created_by_id = user.id)

        OutOrIncome = None

        for obj in fixOutcome:
            # Hier die Logik wie transaktionen prüfen ob fixOutcome 
            if(
            obj.creditor_iban == self.__getAttr(transaction, "creditorAccount")
            and obj.debtor_iban ==  self.__getAttr(transaction, "debtorAccount")
            and obj.creditorName == self.__getAttr(transaction, "creditorName")
            and obj.debtorName == self.__getAttr(transaction, "debtorName")
            and float(transaction.get("transactionAmount").get("amount")) < 0
            ):
                OutOrIncome = "fixOutcome"
                break

        for obj in fixIncome:
            # Hier wird geprüft ob transaktion is fixIncome
            if(
            obj.creditor_iban == self.__getAttr(transaction, "creditorAccount")
            and obj.debtor_iban ==  self.__getAttr(transaction, "debtorAccount")
            and obj.creditorName == self.__getAttr(transaction, "creditorName")
            and obj.debtorName == self.__getAttr(transaction, "debtorName")
            and float(transaction.get("transactionAmount").get("amount")) > 0
            ):
                OutOrIncome = "fixIncome"
                break
        
        return OutOrIncome

    def __getAttr(self, transaction, attr):
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


    # Public Functions:
    def __generateApiKey(self):

        """
        This function gets the token used for all requests to the NordigenAPI
        
        :return: ApiKey
        """

        dataS = {
                "secret_id": self.secret_id,
                "secret_key": self.secret_key
        }

        #Make request tokens
        r = requests.post("https://ob.nordigen.com/api/v2/token/new/" , data=dataS)
        r_status = r.status_code

        if r_status == 200:
            #This Data holds the access as well as the refresh tokens
            data = r.json()
            self.apiKey = data["access"]
        
        else:
            #Token-Request failed
            self.apiKey = None
    
    def getBank(self):
        """
        This function gets the Bank from NordigenAPI.
        :param request: The sent request

        :return: The response of all Banks
        """
        response = Response()

        # Get all Banks:
        headers = {
            "Authorization": "Bearer " + self.apiKey
        }

        #Make request Banks
        r = requests.get("https://ob.nordigen.com/api/v2/institutions/?country=de", headers=headers)
        r_status = r.status_code
            
        if r_status == 200:
            content = r.json()
            response = Response(data=content, status=status.HTTP_200_OK)
        else:
            raise ResponseException(status_code=r_status)

    
        return response

    def getLink(self, request): 
        """
        This function gets the link from the NordigenAPI so that the user can log in
        :param request: The sent request

        :return response: The response = contains the link
        """
        response = Response()

        #Headers auth headers (access token)
        headers = {
            "Authorization": "Bearer " + self.apiKey
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

    def listAccounts(self, request):
    
        """
        This function gets all accounts the user has in NordigenAPI. It safes the account array to the Database
        :param request: The request from the frontend
        
        :return response: The amount of accounts the user has.
        """
        
        access_token = self.apiKey
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

    def list_transactions(self, request):
        """
        This is the final function in the workflow. It gets all transactions from Nordigen
        passes them to parseTransactions() and then returns. 
        :param request: Contains the id for the account requested

        :return: Returns the jsonifyed transaction array
        """
        access_token = self.apiKey
        response = Response()

        #Headers auth headers (access token)
        headers = {
            "Authorization": "Bearer " + access_token
        }

        #Now get accounts-id from DB with id (pos in array)
            #First get the id and user from the request
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
            content = self.__parseTransactions(content, request.user) # This is a json array: [{},{},{}]

            response = Response(data=content, status=status.HTTP_200_OK)
        else:
            raise ResponseException(status_code=r_status)

        return response

    def check_accounts(self, request):
        """
        This function checks if the user already has a accounts. Its called from the dashboard in the frontend.
        It returns the amount of accounts the user has.
        This is the first function called from the frontend so it has to generate the NordigenApiKey
        :param request: The request contains = id, the accountarray-id and user-requested user

        :response amount of accounts the user has
        """

        access_token = self.apiKey
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

    # Public Statistic Functions:

    def budget(request):
        """
        This function gets the montly budget, based on fixOutcomes
        :param: request
        :return: response
        """

        access_token = request.session['access_token']
        response = Response()

        #Headers auth headers (access token)
        headers = {
            "Authorization": "Bearer " + access_token
        }

        #Now get accounts-id from DB with id (pos in array)
            #First get the id and user from the request

        id = request.data["id"]
        user = request.user
        row = Credentials.objects.get(user=user)
        accounts = row.accounts

        account_id = accounts[id]

        #Send request to NORDIGEN to get the Balance
        url = "https://ob.nordigen.com/api/v2/accounts/" + account_id + "/balances/"
        r = requests.get(url, headers=headers)
        r_status = r.status_code

        if r_status == 200:
            content = r.json()
            # Now check which fixAusgaben have already been made this month:

            allAusgaben = FixAusgaben.objects.get(user=user)

            # for obj in transactions:
            #     test = "eints"

            response = Response(data=content, status=status.HTTP_200_OK)
        else:
            raise ResponseException(status_code=r_status)

    def getBarData(self, request):
        """ 
        This function filters the transaction date for income and expenses
        
        :param: The requested data -> { id: Account ID }
        :return: JSON: { income: xx.xx, expenses: xx.xx }
        """

        access_token = self.apiKey
        response = Response()

        #Headers auth headers (access token)
        headers = {
            "Authorization": "Bearer " + access_token
        }

        #Now get accounts-id from DB with id (pos in array)
            #First get the id and user from the request

        id = request.data["id"]
        user = request.user
        row = Credentials.objects.get(user=user)
        accounts = row.accounts

        account_id = accounts[id]


        # Get the raw transaction Data
        url = "https://ob.nordigen.com/api/v2/accounts/" + account_id + "/transactions/"
        r = requests.get(url, headers=headers)
        r_status = r.status_code 

        if r_status == 200:
            content = r.json()

            # TODO: I only work with booked transactions
            booked = content["transactions"]["booked"]

            income = 0.00
            expenses = 0.00

            date_str_init = booked[0].get("bookingDate")
            monthInit = datetime.strptime(date_str_init, "%Y-%m-%d").strftime("%m")
            yearInit = datetime.strptime(date_str_init, "%Y-%m-%d").strftime("%Y")
            initDateStr = yearInit + "-" + monthInit + "-01"
            initDateObj = datetime.strptime(initDateStr, "%Y-%m-%d")

            resultArray = []
            struct = {
                "month": initDateStr,
                "data": []
            }
            resultArray.append(struct)
            i = 0
            ibooked = 0
            for transaction in booked:
                # Get Date and transform it into "%Y-%m-%d" string. Then change the day to 01 and build back to date obj
                date_str = transaction.get("bookingDate")
                month = datetime.strptime(date_str, "%Y-%m-%d").strftime("%m")
                year = datetime.strptime(date_str, "%Y-%m-%d").strftime("%Y")
                newDateStr = year + "-" + month + "-01"
                newDateObj = datetime.strptime(newDateStr, "%Y-%m-%d")
                #################################

                
                if(newDateObj < initDateObj):
                    #first add addData to "finished" Month:
                    addData = {
                        "income": round(income, 2),
                        "expenses": round(expenses, 2)
                    }
                    resultArray[i].get("data").append(addData)
                    expenses = 0.0
                    income = 0.0


                    # new month reached append structAdd to res array 
                    structAdd = {
                        "month": newDateStr,
                        "data": []
                    }
                    resultArray.append(structAdd)
                    initDateObj = newDateObj
                    i = i + 1

                if(float(transaction.get("transactionAmount").get("amount")) < 0): 
                    expenses = expenses + round(float(transaction.get("transactionAmount").get("amount")), 2)
                
                if(float(transaction.get("transactionAmount").get("amount")) > 0): 
                    income = income + round(float(transaction.get("transactionAmount").get("amount")), 2)

                ibooked = ibooked + 1

                #For last run through booked:
                if ibooked == len(booked):
                    addData = {
                            "income": round(income, 2),
                            "expenses": round(expenses, 2)
                        }
                    resultArray[i].get("data").append(addData)

            response = Response(data=resultArray, status=status.HTTP_200_OK)
        else:
            raise ResponseException(status_code=r_status)

        return response

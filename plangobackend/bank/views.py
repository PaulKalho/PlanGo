from email import message
from wsgiref import headers
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, renderer_classes
from .models import Credentials
from .ResponseException import ResponseException


import requests
import json
import os

# def getTokens():
#     #Hier sollen die access und refresh tokens von nordigen abgefragt werden

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
    
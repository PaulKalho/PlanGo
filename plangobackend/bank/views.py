from rest_framework.response import Response
from rest_framework.decorators import api_view
#Nordigen Class:
from .Nordigen import Nordigen
import os

# Init Nordgen Object:
nordigen = Nordigen(os.environ.get("NORDIGEN_SECRET_ID"), os.environ.get("NORDIGEN_SECRET_KEY"))

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

        response = nordigen.getBank()

        return response

@api_view(('POST',))
def get_link(request):
    """
    This function gets the link from the NordigenAPI so that the user can log in
    :param request: The sent request

    :return response: The response = contains the link
    """
    response = Response()

    response = nordigen.getLink()

    return response
@api_view(('POST',))
def list_accounts(request):
    """
    This function gets all accounts the user has in NordigenAPI. It safes the account array to the Database
    :param request: The request from the frontend
    
    :return response: The amount of accounts the user has.
    """
    
    response = Response()
    response = nordigen.listAccounts(request)
    return response

@api_view(('POST',))
def list_transactions(request):
    """
    This is the final function in the workflow. It gets all transactions from Nordigen
    passes them to parseTransactions() and then returns. 
    :param request: Contains the id for the account requested

    :return: Returns the jsonifyed transaction array
    """
    response = Response()
    response = nordigen.list_transactions(request)
    return response

@api_view(('GET', ))
def check_accounts(request):
    """
    This function checks if the user already has a accounts. Its called from the dashboard in the frontend.
    It returns the amount of accounts the user has.
    This is the first function called from the frontend so it has to generate the NordigenApiKey
    :param request: The request contains = id, the accountarray-id and user-requested user

    :response amount of accounts the user has
    """

    response = Response()
    response = nordigen.check_accounts(request)
    return response

@api_view(('POST', ))
def budget(request):
    response = Response()
    response = nordigen.budget(request)
    return response

@api_view(('POST', ))
def getBarData(request):
    """ 
    This function filters the transaction date for income and expenses
    
    :param: The requested data -> { id: Account ID }
    :return: JSON: { income: xx.xx, expenses: xx.xx }
    """

    response = Response()
    response = nordigen.getBarData(request)
    return response




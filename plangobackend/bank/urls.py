from os import stat
from bank.views import get_bank, get_link,list_accounts, list_transactions, check_accounts, budget, getBarData
from django.urls import path, include
from rest_framework.views import exception_handler

from .ResponseException import ResponseException
from rest_framework.response import Response

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    # if response is not None:
    #     response.data['status_code'] = response.status_code
    
    return response

urlpatterns = [
    path('', get_bank, name="get"),
    path('link/', get_link, name="link"),
    path('accounts/', list_accounts, name="accounts"),
    path('transactions/', list_transactions,name="transactions"),
    path('checkacc/', check_accounts, name="checkacc"),
    path('budget/', budget, name="budget"),
    path('getbardata/', getBarData, name="barData")
]

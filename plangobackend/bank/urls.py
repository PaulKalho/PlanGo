from bank.views import get_bank, get_link,list_accounts, list_transactions
from django.urls import path, include

urlpatterns = [
    path('', get_bank, name="get"),
    path('link/', get_link, name="link"),
    path('accounts/', list_accounts, name="accounts"),
    path('transactions/', list_transactions,name="transactions")
]

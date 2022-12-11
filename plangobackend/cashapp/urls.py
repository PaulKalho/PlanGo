
from .views import FixOutcomeView, FixIncomeView, GroupView, TransactionGroupIntermediateView, delete_by_uoi, getPieData
from django.urls import path, include

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('outcome', FixOutcomeView, basename="outcome")
router.register('income', FixIncomeView, basename="income")
router.register('group', GroupView, basename="group")
router.register('transactionGroup', TransactionGroupIntermediateView, basename="trcgroupintermediate")

urlpatterns = [
    path('', include(router.urls)),
    path('deleteTransactionIntermediate/', delete_by_uoi),
    path('statistics/', getPieData)
]
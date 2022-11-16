
from .views import FixOutcomeView, FixIncomeView, GroupView, TransactionGroupIntermediateView, get_group
from django.urls import path, include

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('outcome', FixOutcomeView, basename="outcome")
router.register('income', FixIncomeView, basename="income")
router.register('group', GroupView, basename="group")
router.register('transactionGroup', TransactionGroupIntermediateView, basename="trcgroupintermediate")

urlpatterns = [
    path('', include(router.urls)),
    path('isgroup/', get_group, name="getgroup")
]
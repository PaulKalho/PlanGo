
from .views import FixOutcomeView, FixIncomeView, GroupView
from django.urls import path, include

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('outcome', FixOutcomeView, basename="outcome")
router.register('income', FixIncomeView, basename="income")
router.register('group', GroupView, basename="group")

urlpatterns = [
    path('', include(router.urls)),
]
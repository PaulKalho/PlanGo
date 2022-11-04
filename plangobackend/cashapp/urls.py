
from .views import FixOutcomeView, FixIncomeView
from django.urls import path, include

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('outcome', FixOutcomeView, basename="outcome")
router.register('income', FixIncomeView, basename="income")

urlpatterns = [
    path('', include(router.urls)),
]
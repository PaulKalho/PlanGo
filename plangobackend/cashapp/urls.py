
from .views import CashAppView
from django.urls import path, include

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('cashapp', CashAppView, basename="cashapp")

urlpatterns = [
    path('', include(router.urls)),
]
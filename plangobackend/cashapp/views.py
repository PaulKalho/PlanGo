from django.shortcuts import render
from rest_framework import viewsets

from .models import FixAusgaben, FixIncome
from .serializers import AusgabenSerializer, IncomeSerializer
# Serializer?????

#Funktion die einen Eintrag in Fixausgaben schreibt
class FixOutcomeView(viewsets.ModelViewSet):
    queryset = FixAusgaben.objects.all()
    serializer_class = AusgabenSerializer

    def get_queryset(self):
        #Return all Entrys according to user
        return self.queryset.filter(created_by = self.request.user.id )

    def perform_create(self, serializer):
        #Save new entry
        serializer.save(created_by = self.request.user)


class FixIncomeView(viewsets.ModelViewSet):
    queryset = FixIncome.objects.all()
    serializer_class = IncomeSerializer

    def get_queryset(self):
        #Return all Entrys according to user
        return self.queryset.filter(created_by = self.request.user.id )

    def perform_create(self, serializer):
        #Save new entry
        serializer.save(created_by = self.request.user)



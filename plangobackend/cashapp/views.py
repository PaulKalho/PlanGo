from django.shortcuts import render
from rest_framework import viewsets

from .models import FixAusgaben
from .serializers import AusgabenSerializer
# Serializer?????

#Funktion die einen Eintrag in Fixausgaben schreibt
class CashAppView(viewsets.ModelViewSet):
    queryset = FixAusgaben.objects.all()
    serializer_class = AusgabenSerializer

    def get_queryset(self):
        #Return all Entrys according to user
        return self.queryset.filter(created_by = self.request.user.id )

    def perform_create(self, serializer):
        #Save new entry
        
        serializer.save(created_by = self.request.user)





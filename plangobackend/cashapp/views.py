from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view, renderer_classes
from rest_framework import status
from rest_framework.response import Response
from .ResponseException import ResponseException

from .models import FixAusgaben, FixIncome, Group, TransactionGroupIntermediate
from .serializers import AusgabenSerializer, IncomeSerializer, GroupSerializer, TransactionGroupIntermediateSerializer

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

class GroupView(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    def get_queryset(self):
        return self.queryset.filter(created_by = self.request.user.id)

    def perform_create(self, serializer):
        serializer.save(created_by = self.request.user)

class TransactionGroupIntermediateView(viewsets.ModelViewSet):
    queryset = TransactionGroupIntermediate.objects.all()
    serializer_class = TransactionGroupIntermediateSerializer

    def get_queryset(self):
        return self.queryset.filter(created_by = self.request.user.id)

    def perform_create(self, serializer):
        return serializer.save(created_by = self.request.user)



# Get the groupp for a specific transaction
@api_view(('POST',))
def get_group(request):
    transaction_id = request.data["transaction_id"]

    #Get Transaction and group from it with the transaction_id
    try:
        row = TransactionGroupIntermediate.objects.get(transaction_id=transaction_id)
        group = row.group.name
        response = Response(data=group, status=status.HTTP_200_OK)
    except TransactionGroupIntermediate.DoesNotExist:
        raise ResponseException(status_code=404)

    return response




        
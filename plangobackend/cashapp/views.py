from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view, renderer_classes
from rest_framework import status
from rest_framework.response import Response
from .ResponseException import ResponseException
from django.db.models import Sum
from django.db.models.functions import TruncMonth

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

@api_view(('POST',))
def delete_by_uoi(request):
    """
    This function is used to delete a entry from transactiongroupintermediate by its uoi

    :request: The sent request { uoi: "uoi"}

    :response: 200 OKAY
    """
    # TODO: Catch Error not found!
    TransactionGroupIntermediate.objects.get(transaction_id = request.data["uoi"]).delete()
    return Response(status=status.HTTP_200_OK)

@api_view(('GET',))
def getStatisticData(request):
    # SELECT G.name AS groupname, EXTRACT(MONTH FROM cashapp_transactiongroupintermediate.month) AS month, SUM(cashapp_transactiongroupintermediate.amount) AS summe FROM cashapp_group AS G
	#      RIGHT JOIN cashapp_transactiongroupintermediate ON G.id= cashapp_transactiongroupintermediate.group_id
    # GROUP BY (G.name, EXTRACT(MONTH FROM cashapp_transactiongroupintermediate.month))
    # TODO: Error Handling 
    """
    This function groups the transactionGroupIntermediate by month and group and then aggregates the values of
    the transactions.
    :request: The request sent

    :return: Response of the query
    """
    queryset = TransactionGroupIntermediate.objects.filter(created_by_id=request.user.id).values("group", month_r=TruncMonth('month')).annotate(amount_r=Sum("amount")).order_by(TruncMonth('month'))

    return Response(status=status.HTTP_200_OK, data=queryset)






        
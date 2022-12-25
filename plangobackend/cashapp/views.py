from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view, renderer_classes, action
from rest_framework import status
from rest_framework.response import Response
from .ResponseException import ResponseException
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth, TruncYear
from datetime import datetime

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
    
    @action(detail = False, methods=['POST'], name="Delete By")
    def deleteBy(self, request):
        """
        This function is used to delete a entry from fixIncome by its uoi

        :request: The sent request { 
                creditorName: 
                debtorName:  
                amount: 
                creditor_iban: 
                debtor_iban:
                }

        :response: 200 OKAY
        """
        FixAusgaben.objects.get(
                                creditorName = request.data["creditorName"],
                                debtorName = request.data["debtorName"],
                                amount = request.data["amount"],
                                creditor_iban  = request.data["creditor_iban"],
                                debtor_iban = request.data["debtor_iban"],
                                created_by = request.user
                            ).delete()
        return Response(status=status.HTTP_200_OK)



class FixIncomeView(viewsets.ModelViewSet):
    queryset = FixIncome.objects.all()
    serializer_class = IncomeSerializer

    def get_queryset(self):
        #Return all Entrys according to user
        return self.queryset.filter(created_by = self.request.user.id )

    def perform_create(self, serializer):
        #Save new entry
        serializer.save(created_by = self.request.user)

    @action(detail = False, methods=['POST'], name="Delete By")
    def deleteBy(self, request):
        """
        This function is used to delete a entry from fixIncome by its uoi

        :request: The sent request { 
                creditorName: 
                debtorName:  
                amount: 
                creditor_iban: 
                debtor_iban:
                }

        :response: 200 OKAY
        """
        FixIncome.objects.get(
                                creditorName = request.data["creditorName"],
                                debtorName = request.data["debtorName"],
                                amount = request.data["amount"],
                                creditor_iban  = request.data["creditor_iban"],
                                debtor_iban = request.data["debtor_iban"],
                                created_by = request.user
                            ).delete()
        return Response(status=status.HTTP_200_OK)


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
    
    def deleteBy(request):
        """
        This function is used to delete a entry from transactiongroupintermediate by its uoi

        :request: The sent request { uoi: "uoi"}

        :response: 200 OKAY
        """
        # TODO: Catch Error not found!
        TransactionGroupIntermediate.objects.get(transaction_id = request.data["uoi"]).delete()
        return Response(status=status.HTTP_200_OK)


@api_view(('GET',))
def getPieData(request):
    """
    This function groups the transactionGroupIntermediate by month and group and then aggregates the values of
    the transactions.
    :request: The request sent

    :return: Response of the query
    """
    # I want it to look like: 
    # resArray: {  
    #   data: [
    #      0: 
    #       month: 2022-03-01
    #       group: [
    #           0: {
    #               name: "31",
    #               amount: "22,49"
    #           }
    #           1: {
    #               name: "31",
    #               amount: "22,49"
    #           }   
    #       ]
    #      1: 
    #       month: 2022-02-01
    #       group: []
    #   ]
    #}
    queryset = TransactionGroupIntermediate.objects.values("group_id").annotate(sum_r = Sum('amount'), month_r=(TruncMonth('month')), year_r=TruncYear('month')).filter(created_by_id=request.user.id).values("month_r", "sum_r", "group_id").order_by("-month_r", "-year_r")
    """ The following groups the queryset by months: """
    
    if queryset:
        # Initializing Variable: (greatest month)
        init = queryset[0].get("month_r")
        resultArray = []
        addInit = {
            "month": init,
            "group": []
        }
        resultArray.append(addInit)
        i = 0

        for element in queryset:
            add = {
                "month": element.get("month_r"),
                "group": []
            }

            # Check if month in element is smaller init. 
            if(element.get("month_r") < init):
                # If yes then go foarward in result array
                init = element.get("month_r")
                resultArray.append(add)
                i = i+1

            groupElement = {
                "name": Group.objects.get(id=element.get("group_id")).name,
                "amount": element.get("sum_r"),
            }

            resultArray[i].get("group").append(groupElement)    

        return Response(status=status.HTTP_200_OK, data=resultArray)
    else: 
        return ResponseException("Noch keine Gruppierung vorgenommen!")









        
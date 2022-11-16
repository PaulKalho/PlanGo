from rest_framework import serializers
from rest_framework.serializers import ValidationError

from .models import FixAusgaben, FixIncome, Group, TransactionGroupIntermediate

class AusgabenSerializer(serializers.ModelSerializer): 
    def validate(self, data):
        if(data['amount'] > 0):
            raise serializers.ValidationError("Betrag darf nicht Plus sein!")
        return data
    
    class Meta:
        model = FixAusgaben
        read_only_fields = (
            'created_by_id',
        )
        fields = (
            'id',
            'creditorName',
            'debtorName',
            'amount',
            'created_by_id',
            'mandate_id',
            'creditor_iban',
            'debtor_iban'
        )

class IncomeSerializer(serializers.ModelSerializer): 
    def validate(self, data):
        if(data['amount'] < 0):
            raise serializers.ValidationError("Betrag darf nicht Minus sein!")
        return data
    
    class Meta:
        model = FixIncome
        read_only_fields = (
            'created_by_id',
        )
        fields = (
            'id',
            'creditorName',
            'debtorName',
            'amount',
            'created_by_id',
            'mandate_id',
            'creditor_iban',
            'debtor_iban'
        )

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        read_only_fields = (
            'created_by_id',
        ) 
        fields = (
            'id',
            'name',
            'created_by_id'
        )

class TransactionGroupIntermediateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionGroupIntermediate
        read_only_fields = (
            'created_by',    
        )
        fields = (
            'id',
            'transaction_id',
            'month',
            'amount',
            'group',
            'created_by_id'
        )
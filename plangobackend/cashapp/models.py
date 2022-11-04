from django.db import models
from users.models import CustomUser

class FixAusgaben(models.Model):
    creditorName = models.CharField(max_length=255)
    debtorName = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=6,decimal_places=2)
    mandate_id = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.ForeignKey(CustomUser, related_name='ausgaben_user', on_delete=models.CASCADE, default=1)
    creditor_iban = models.CharField(max_length=255)
    debtor_iban = models.CharField(max_length=255)

class FixIncome(models.Model):
    creditorName = models.CharField(max_length=255)
    debtorName = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=6,decimal_places=2)
    mandate_id = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.ForeignKey(CustomUser, related_name='income_user', on_delete=models.CASCADE, default=1)
    creditor_iban = models.CharField(max_length=255)
    debtor_iban = models.CharField(max_length=255)
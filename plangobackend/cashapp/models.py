from django.db import models
from users.models import CustomUser

class FixAusgaben(models.Model):
    creditorName = models.CharField(max_length=255, blank=True, null=True)
    debtorName = models.CharField(max_length=255, blank=True, null=True)
    amount = models.DecimalField(max_digits=6,decimal_places=2, blank=True, null=True)
    mandate_id = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.ForeignKey(CustomUser, related_name='ausgaben_user', on_delete=models.CASCADE, default=1)
    creditor_iban = models.CharField(max_length=255, blank=True, null=True)
    debtor_iban = models.CharField(max_length=255, blank=True, null=True)

class FixIncome(models.Model):
    creditorName = models.CharField(max_length=255, blank=True, null=True)
    debtorName = models.CharField(max_length=255, blank=True, null=True)
    amount = models.DecimalField(max_digits=6,decimal_places=2 ,blank=True, null=True)
    mandate_id = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.ForeignKey(CustomUser, related_name='income_user', on_delete=models.CASCADE, default=1)
    creditor_iban = models.CharField(max_length=255, blank=True, null=True)
    debtor_iban = models.CharField(max_length=255, blank=True, null=True)

class Group(models.Model):
    name = models.CharField(max_length=255)
    created_by = models.ForeignKey(CustomUser, related_name='group_user', on_delete=models.CASCADE, default=1)

# Modell für Transaktionsstatisik:
class TransactionGroupIntermediate(models.Model):
    transaction_id = models.CharField(max_length=400)
    month = models.DateField()
    amount = models.DecimalField(max_digits=6,decimal_places=2)
    group = models.ForeignKey(Group, related_name='transaction_group', on_delete=models.CASCADE, default=1)
    created_by = models.ForeignKey(CustomUser, related_name='intermediate_user', on_delete=models.CASCADE, default=1)



# ---------------------------------------------------------
# transaction_id | month | amount | group | created_by 
# aasdasd-asdasd | 09/22 | 69,69  |   2   |     1
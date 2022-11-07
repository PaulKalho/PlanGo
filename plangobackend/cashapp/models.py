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

class Group(models.Model):
    name = models.CharField(max_length=255)
    created_by = models.ForeignKey(CustomUser, related_name='group_user', on_delete=models.CASCADE, default=1)


# Modell für Transaktionsstatisik:
# user, monat, amount, id <- ID muss noch überlegt werden, wie diese zusammengestellt wird
# Idee: Algortihmus der aus verschiedenen Daten immer eine gleiche ID generiert. Problem: Hoher rechenaufwand
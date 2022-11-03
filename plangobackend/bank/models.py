from django.db import models
from django.contrib.postgres.fields import ArrayField
from users.models import CustomUser

# Create your models here.
class Credentials(models.Model):
    user = models.ForeignKey(CustomUser, related_name='user_task', on_delete=models.CASCADE, default=1)
    institution = models.CharField(max_length=255)
    accounts = ArrayField(models.CharField(max_length=255), blank=True, null=True)
    # Postgres passwort: admin.2019


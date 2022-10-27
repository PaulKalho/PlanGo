from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class Credentials(models.Model):
    user = models.CharField(max_length=255, unique=True)
    institution = models.CharField(max_length=255)
    accounts = ArrayField(models.CharField(max_length=255), blank=True, null=True)

    # TODO: User als das:
    # user =  models.ForeignKey(User, related_name='user_task', on_delete=models.CASCADE, default=1)
    # Postgres passwort: admin.2019
# Generated by Django 4.1.2 on 2022-10-30 14:21

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('bank', '0002_alter_credentials_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='credentials',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='user_task', to=settings.AUTH_USER_MODEL),
        ),
    ]

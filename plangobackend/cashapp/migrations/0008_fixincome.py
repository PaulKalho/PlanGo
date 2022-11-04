# Generated by Django 4.1.2 on 2022-11-04 08:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('cashapp', '0007_alter_fixausgaben_mandate_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='FixIncome',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creditorName', models.CharField(max_length=255)),
                ('debtorName', models.CharField(max_length=255)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=6)),
                ('mandate_id', models.CharField(blank=True, max_length=255, null=True)),
                ('creditor_iban', models.CharField(max_length=255)),
                ('debtor_iban', models.CharField(max_length=255)),
                ('created_by', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='income_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]

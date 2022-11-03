# Generated by Django 4.1.2 on 2022-11-03 01:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cashapp', '0004_remove_fixausgaben_iban_fixausgaben_mandate_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='fixausgaben',
            name='creditor_iban',
            field=models.CharField(default='default', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='fixausgaben',
            name='debtor_iban',
            field=models.CharField(default='default', max_length=255),
            preserve_default=False,
        ),
    ]

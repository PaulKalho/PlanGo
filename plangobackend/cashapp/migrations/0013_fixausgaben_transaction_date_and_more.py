# Generated by Django 4.1.2 on 2022-11-20 20:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cashapp', '0012_alter_fixausgaben_amount_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='fixausgaben',
            name='transaction_date',
            field=models.DateField(default=None),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='fixincome',
            name='transaction_date',
            field=models.DateField(default=None),
            preserve_default=False,
        ),
    ]

# Generated by Django 4.1.2 on 2022-10-27 18:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bank', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='credentials',
            name='user',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]
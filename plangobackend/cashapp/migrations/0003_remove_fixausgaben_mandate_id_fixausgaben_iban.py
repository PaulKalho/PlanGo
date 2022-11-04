# Generated by Django 4.1.2 on 2022-11-03 00:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cashapp', '0002_fixausgaben_mandate_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='fixausgaben',
            name='mandate_id',
        ),
        migrations.AddField(
            model_name='fixausgaben',
            name='iban',
            field=models.CharField(default='default', max_length=255),
            preserve_default=False,
        ),
    ]
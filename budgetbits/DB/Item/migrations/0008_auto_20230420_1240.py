# Generated by Django 3.2.12 on 2023-04-20 12:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Item', '0007_auto_20230420_1239'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='brand',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='item',
            name='price',
            field=models.IntegerField(default=47),
        ),
    ]

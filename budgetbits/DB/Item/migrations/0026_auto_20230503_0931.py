# Generated by Django 3.2.12 on 2023-05-03 09:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Item', '0025_alter_ica_luthagen_expiry_date'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='recipe_ingredients',
            name='measurement_amount_id',
        ),
        migrations.AddField(
            model_name='recipe_ingredients',
            name='amount',
            field=models.CharField(default='', max_length=25),
        ),
        migrations.DeleteModel(
            name='Measurement_amount',
        ),
    ]

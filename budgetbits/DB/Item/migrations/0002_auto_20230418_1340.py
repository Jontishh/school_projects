# Generated by Django 3.2.12 on 2023-04-18 13:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Item', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='item',
            old_name='price',
            new_name='energy',
        ),
        migrations.RemoveField(
            model_name='item',
            name='date',
        ),
        migrations.AddField(
            model_name='item',
            name='brand',
            field=models.CharField(default=0, max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='item',
            name='weight',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='item',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]

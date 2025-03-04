from django.db import models
import random
# Create your models here.
class Item(models.Model):
    id=models.BigIntegerField(primary_key=True, default=0)
    brand=models.CharField(max_length=100, null=True, blank=True)
    weight=models.CharField(max_length=100, null=True)
    name = models.CharField(max_length=100, default='')
    # price=models.IntegerField(default=random.randint(10, 100))
    # discounted_price=models.IntegerField(default=20)
    # stock=models.IntegerField(default=40)
    image=models.URLField(null=True, default='')
    pantry_product= models.BooleanField(default=False)

    class Meta:
        db_table='Item'
    
    def __str__(self):
        return str(self.name)
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


class ICA_Luthagen(models.Model):
    product = models.ForeignKey(Item, on_delete=models.CASCADE, primary_key=True)
    stock = models.IntegerField(default=0)
    # is expiry date same for everything in stock?
    # or 
    expiry_date = models.DateField('Expiry date')
    price = models.IntegerField(default=0)
    discounted_price = models.IntegerField(default = 0)
    # product customer is expected to have in pantry  


class Recipe(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)
    image = models.URLField(null=True, default='')
    description = models.CharField(max_length=200)
    instructions = models.CharField(max_length=500)
    rating=models.IntegerField(default=0)
    servings=models.IntegerField(default=2)
    time=models.IntegerField(default=30)
    category=models.IntegerField(default=0)



class Measurement_unit(models.Model):
    id = models.IntegerField(primary_key=True)
    measurement_name = models.CharField(max_length=25)

class Recipe_Ingredients(models.Model):
    recipe_id = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient_id = models.ForeignKey(Item, on_delete=models.CASCADE)
    measurement_amount = models.CharField(max_length=25, default='')
    measurement_unit_id = models.ForeignKey(Measurement_unit, on_delete=models.CASCADE)
    key_ingredient = models.BooleanField(default=False)
    ingredient_amount=models.IntegerField(default=0)




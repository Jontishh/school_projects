from rest_framework import serializers
from .models import *

class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item 
        fields = ('id','name', 'brand', 'weight', 'pantry_product', 'image')

class IcaLuthagenSerializer(serializers.ModelSerializer):
    class Meta:
        model = ICA_Luthagen
        fields = ('product_id', 'stock', 'expiry_date', 'price', 'discounted_price')

class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ('id', 'name', 'description', 'instructions','rating','servings','time', 'image', 'category')

class MeasurementUnitSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Measurement_unit
        fields = ('id', 'measurement_name')

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe_Ingredients
        fields = ('recipe_id_id', 'ingredient_id_id','measurement_amount', 'measurement_unit_id_id', 'ingredient_amount')

class ItemInfoSerializer(serializers.Serializer):
    id=serializers.IntegerField()
    name=serializers.CharField()
    expiry_date=serializers.DateField()
    price=serializers.IntegerField()
    discounted_price=serializers.IntegerField()
    weight=serializers.IntegerField()
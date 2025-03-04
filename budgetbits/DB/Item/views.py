from django.shortcuts import render
from .models import Item
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializer import *
from django.db.models import Q
from django.core import serializers
from itertools import chain


# Create your views here.
def index(request):
    return render(request,'form.html')

def add_item(request):
    return render(request,'Item/add.html',{'msg':'Add item'})
def add_item_output(request):
    en=Item(id=request.POST.get('id'),name=request.POST.get('name'),
     price=request.POST.get('price'),date=request.POST.get('date'))
    if (Item.objects.filter(id=request.POST.get('id')).exists()):
         return render(request, 'Item/add.html', {'msg':"Data insertion failed. ID already exists"})
    en.save()
    str1="Data inserted to item table" 
    return render(request,'Item/add.html',{'msg':str1})

def delete_item(request):
     return render(request, 'Item/delete_item.html', {'msg':'Delete item'})

def delete_item_output(request):
     Item.objects.filter(id=request.POST.get('id')).delete()
     return render(request, 'Item/delete_item.html', {'msg':'Deleted item'})

def display(request):
	st=Item.objects.all() # Collect all records from table 
	return render(request,'Item/display.html',{'st':st})

@api_view(['GET'])
def getItem(request, key_id):
    if request.method == 'GET':
        query = key_id
        data = Item.objects.get(id=query)
        serializer = ItemSerializer(data, context={'request':request}, many=False)
        return Response(serializer.data)
    
@api_view(['GET', 'POST'])
def item_list(request, ):
    if request.method == 'GET':
        result = []
        data = ICA_Luthagen.objects.all()
        for entry in data:
                item = Item.objects.get(id=entry.product_id)
                serializer2 = ItemSerializer(item, context={'request':request}, many=True)

                y = ({'id':item.id ,'name':item.name, 'weight':item.weight, 'brand':item.brand
                      , 'expiry_date':entry.expiry_date, 'price':entry.price, 'discounted_price':entry.discounted_price, 'image':item.image})
                result.append(y)
        

        return Response(result)

    elif request.method == 'POST':
        serializer = ItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET']) 
def searchItem(request, name):
    if request.method == 'GET':
        query = name
        items = Item.objects.filter(Q(name__icontains=query))
        data= []
        for item in items:
            try:
                ICA_Items = ICA_Luthagen.objects.get(product_id=item.id)
            except:
                data = data
            if ICA_Items:
                data=({'id':item.id ,'name':item.name, 'weight':item.weight, 'brand':item.brand
                      , 'expiry_date':ICA_Items.expiry_date, 'price':ICA_Items.price, 'discounted_price':ICA_Items.discounted_price})
        if ICA_Items:
            return Response(data)
        else:
            return Response()

@api_view(['GET'])    
def getALLRecipes(request):
    if request.method == 'GET':
        data = Recipe.objects.all()
        if data:
            serializer = RecipeSerializer(data, context={'request':request}, many=True)
            return Response(serializer.data)
        else:
            return Response()

@api_view(['GET'])    
def getRecipe(request, id):
    if request.method == 'GET':
        data = Recipe.objects.filter(id=id)
        if data:
            serializer = RecipeSerializer(data, context={'request':request}, many=True)
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   
        
@api_view(['GET'])    
def getIngredients(request, recipe_id):
    if request.method == 'GET':
        data = Recipe_Ingredients.objects.filter(recipe_id=recipe_id)
        if data:
            serializer = IngredientSerializer(data, context={'request':request}, many=True)
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])    
def getMeasurementUnit(request, id):
    if request.method == 'GET':
        data = Measurement_unit.objects.filter(id=id)
        if data:
            serializer = MeasurementUnitSerializer(data, context={'request':request}, many=True)
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   
@api_view(['GET'])
def getDiscountRecipes(request):
    if request.method == 'GET':
       discountRecipes = []
       recipes = Recipe.objects.all()
       for recipe in recipes:
           ingredients = Recipe_Ingredients.objects.filter(recipe_id=recipe.id)
           for ingredient in ingredients:
               if ingredient.key_ingredient:
                item = ICA_Luthagen.objects.filter(product_id=ingredient.ingredient_id)
                if item.count() > 0:
                    discountRecipes.append(recipe)
    serializer = RecipeSerializer(discountRecipes, context={'request':request}, many=True)
    return Response(serializer.data)


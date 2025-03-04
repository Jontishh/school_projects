"""ProjectDB URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from Item import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('Item/display',views.display,name='display'),
    path('Item/add', views.add_item, name='add_item'),
    path('Item/add_item_output', views.add_item_output, name='add_item_output'),
    path('Item/delete_item', views.delete_item, name='delete_item'),
    path('Item/delete_item_output', views.delete_item_output, name='delete_item_output'),
    re_path(r'^Item/items/$', views.item_list),
    re_path(r'^Item/items/(?P<key_id>[0-9])/$', views.getItem, name='getItem'),
    re_path(r'^Item/items/(?P<key_id>[0-9][0-9])/$', views.getItem, name='getItem'),
    re_path(r'^Item/items/(?P<key_id>[0-9][0-9][0-9])/$', views.getItem, name='getItem'),
    re_path(r'^Item/items/(?P<key_id>[0-9][0-9][0-9][0-9])/$', views.getItem, name='getItem'),
    re_path(r'^Item/items/(?P<key_id>[0-9][0-9][0-9][0-9][0-9])/$', views.getItem, name='getItem'),
    re_path(r'^Item/search/(?P<name>\D+)/$', views.searchItem, name='searchItem'),
    path('Recipe/all', views.getALLRecipes, name='getALLRecipes'),
    re_path(r'^Recipe/(?P<id>[0-9])/$', views.getRecipe, name='getRecipe'),
    re_path(r'^Ingredient/(?P<recipe_id>[0-9])/$', views.getIngredients, name='getIngredients'),
    re_path(r'^MeasurementUnit/(?P<id>[0-9])/$', views.getMeasurementUnit, name='getMeasurementUnit'),
    path('Recipe/filtered', views.getDiscountRecipes, name='getDiscountRecipes')
    ]


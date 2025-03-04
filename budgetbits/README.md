# HELIUM

# To start remote Django server:
Go to HELIUM folder  
Ubuntu:  
ssh -i E2DJANGO.pem ubuntu@13.50.248.6  
python3 manage.py runserver 0:8000  

Mac:
    Chmod 400 E2DJANGO.pem
    ssh -i E2DJANGO.pem ubuntu@13.50.248.6

Start the server by navigating to the DB folder
    cd DB
    python3 manage.py runserver 0:8000  
    
# Usage of Django links
### Basic URL
http://ec2-13-50-248-6.eu-north-1.compute.amazonaws.com:8000

### /Item/items
gives all items from the ICA_Luthagen database currently.
REturns following format:

[{
        "id": 1,
        "name": "Nötfärs",
        "weight": "500g",
        "brand": "ICA",
        "expiry_date": "2023-05-10",
        "price": 65,
        "discounted_price": 30
    }]
    
### /Recipe/all
returns all recipes on format:
[
    {
        "id": 1,
        "name": "Omelette",
        "description": "Sjukt enkel rätt!",
        "instructions": "Vispa ihop ingredienser, hetta upp matfettet i pannan och tillaga omeletten under omrörning."
    }
]
### /Recipe/<id>
returns the recipe with the id specified

### /Ingredient/<recipe_id>
Returns all ingredients tied to the recipe_id specified

### /MeasurementUnit/<id>
returns the measurement unit tied to the specified id.



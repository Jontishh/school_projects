import React, { useState, useEffect} from "react";
import { StyleSheet, TouchableOpacity, View, Text, Dimensions, ActivityIndicator, Image, FlatList } from "react-native";
import StarRating from "./StarRating";
import store from "./store";

{ var lightGrey = '#EEEEEE'; }
{ var borderRadius = 20; }
{ var defaultColor = '#01be12'; }     // Default color that is green

console.disableYellowBox = true;

export default function RecipeScreen({ route, navigation }) {

    const {recipeId} = route.params;
    const [showIngredients, setShow] = useState(true);
    const [showDropdown, setDropdown] = useState(false);

    const [isRecipeLoading, setRecipeLoading] = useState(true);
    const [isIngredientsLoading, setIngredientsLoading] = useState(true);
    const [isItemsLoading, setItemsLoading] = useState(true);

    const [recipe, setRecipe] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [items, setItems] = useState([]);

    const urlRecipe = "http://ec2-13-50-248-6.eu-north-1.compute.amazonaws.com:8000/Recipe/all"
    const urlIngredients = "http://ec2-13-50-248-6.eu-north-1.compute.amazonaws.com:8000/Ingredient/"+recipeId
    const urlItems = 'http://ec2-13-50-248-6.eu-north-1.compute.amazonaws.com:8000/Item/items/'


    const getRecipe = async () => {
        try{
        const response = await fetch(urlRecipe);
        const json = await response.json();
        setRecipe(json);
       
        }
        catch (error) {
            console.log(error);
          }
        finally {
            setRecipeLoading(false);
            console.log(recipe)
          }
        }
        useEffect(() => {
            getRecipe();
        }, []);

    
    const getIngredients = async () => {
        try{
        const response = await fetch(urlIngredients);
        const json = await response.json();
        setIngredients(json);
        
        }
        catch (error) {
            console.log(error);
            }
        finally {
            setIngredientsLoading(false);
            console.log(ingredients);
            }
        }
        useEffect(() => {
            getIngredients();
          }, []);


          const getItems = async () => {
            try {
              const response = await fetch(urlItems);
              const json = await response.json();
              setItems(json);

            } catch (error) {
              console.log(error);

            } finally {
              setItemsLoading(false);
            }
          };
        
        useEffect(() => {
            getItems();
            }, []);

        
    const renderRecipe = () => {
        const recipeItem = recipe.find(item => item.id === recipeId);
        if (recipeItem) {
            return (
            <View>
                <Image
                    source={{ uri: recipeItem.image}} // Use the URL from the recipe object
                    style={styles.image}
                />
                <Text style={styles.title}>
                    {recipeItem.name}
                </Text>
                <View style={styles.container2}>
                    {/*This component is what renders the stars depending on the recipe rating */}
                    <StarRating ratingObj={{ ratings: recipeItem.rating }} />  

                    <Text style={styles.breadText}>{"Antal portioner: " + recipeItem.servings}</Text>
                    <Text style={styles.breadText}>{"Tid: " +recipeItem.time + " min"}</Text>
                 </View>
            </View>
            );
        } else {
            return null; // Recipe not found
        }
        };

        const renderIngredients = () => {
            const recipeItem = recipe.find((item) => item.id === recipeId);
            if (recipeItem) {
              return (
                <FlatList
                  data={ingredients}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => {
                    const ingredient = items.find((i) => i.id === item.ingredient_id_id);
                    if (ingredient) {
                      return (
                        <TouchableOpacity
                          style={styles.products}
                    
                          onPressIn={() => {
                            const newData = [...items];
                            const index = newData.findIndex((i) => i.id === item.ingredient_id_id);
          
                            if (index !== -1) {
                              newData[index].showDropdown = !newData[index].showDropdown;
                              setItems(newData);
                            }
                          }}
                        >
                            
                        <Image
                            source={{ uri: ingredient.image }}
                            style={styles.logo}
                        />

                          <Text style={styles.txtStyle}>{ingredient.name}</Text>
                          <TouchableOpacity 
                            style={styles.addButton}
                            onPress={() => {
                                store.dispatch({ type: 'SET_PRODUCT', payload: ingredient, amount:1});  //KANSKE SKA SKICKA MED item.name?
                            }}>
                            <Text style={{color: defaultColor, fontWeight: 'condensed'}}>
                                {'\n Lägg till i'}
                                {'\nvarukorgen'}
                            </Text>
                        </TouchableOpacity>

                          {ingredient.showDropdown && (
                            <View style={[styles.dropdown, styles.shadow]}>
                              <View style={styles.section}>
                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                  {ingredient.name + ", " + ingredient.brand}
                                </Text>
                                <Text style={styles.dropdownText}>
                                  {"Vikt: " + ingredient.weight}
                                </Text>
                                <Text style={styles.dropdownText}>
                                  {"Utgångsdatum: " + ingredient.expiry_date}
                                </Text>
                                <Text style={styles.dropdownText}>
                                  {"Normalpris: " + ingredient.price}
                                </Text>
                                <Text style={{ fontWeight: 800, color: "green" }}>
                                  {"Rabatterat Pris: " + ingredient.discounted_price}
                                </Text>
                              </View>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    } else {
                      return null; // Ingredient not found
                    }
                  }}
                />
              );
            } else {
              return (
                <Text style={{ fontSize: 30, alignSelf: "center" }}>
                  ERROR: SOMETHING WENT WRONG
                </Text>
              );
            }
          };
              
              
        const renderDescription = () => {
            const recipeItem = recipe.find(item => item.id === recipeId);
            if (recipeItem) {
                return (
                <Text>{recipeItem.instructions}</Text>    
                );
            } else {
                return null; // Recipe not found
            }
            };


      renderViews = () => {
        if (showIngredients) {
            return (
                <View style={styles.container}>
                    {(isRecipeLoading&&isIngredientsLoading&&isItemsLoading) ? (
                        <ActivityIndicator />
                    ) : (
                        <>
                            <View style={{marginBottom:70, width: Dimensions.get('window').width-50,}}>{renderIngredients()}</View> 
                            
                        </>
                    )}
                </View>
            )
        } else {    
            return (
                <View style={styles.container}>
                    {renderDescription()}
                </View>
            );
        }
    };
    

    return (
        <View style={styles.container}>
            {(isRecipeLoading&&isIngredientsLoading&&isItemsLoading) ? (
                <ActivityIndicator />
                ) : (<>
                      
            <View style={{marginTop: -110}}>{renderRecipe()}</View>
            
            <View style={styles.container3}>
                <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => setShow(true)}
                >
                    <Text style={styles.buttontexts} >Ingredienser</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => setShow(false)}
                >
                    <Text style={styles.buttontexts} >Gör så här</Text>
                </TouchableOpacity>
            </View>
            {renderViews()}
            </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        paddingTop:20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    container2: {
        width: Dimensions.get('window').width,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    container3: {
        width: Dimensions.get('window').width,
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    title: {
        padding: 10,
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    breadText:{
        fontSize: 16,
        fontWeight: '500',
    },
    buttontexts: {
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
    buttons: {
        padding: 3,
        alignItems: 'center',
    },
    image:{
        resizeMode: 'contain',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        aspectRatio: 1, // Adjust the aspect ratio to control the image size
        borderTopRightRadius: borderRadius,
        borderTopLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,
    },
    txtStyle: {
        fontWeight: 'bold',
        padding: 10,
        marginBottom: 20,
        marginLeft: 70,
    },
    dropdown: {
        backgroundColor: 'white',
        marginBottom: 10,
        marginTop: -10,
        marginLeft: 17,
        paddingTop: 10,
        width: '90%',
        height: 120,
        borderTopRightRadius: borderRadius,
        borderTopLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,
    },
    dropdownText: {
        paddingLeft: 5,
        paddingRight: 5,
    },
    shadow: {
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 2, // Android
    },
    section: {
        alignItems: 'center',
        width: '90%',
    },
    logo: {
        marginLeft: 20,   //Margins to controll that the picture gets in the right position
        marginTop: 10,
        marginBottom: -45,
        width: 50,
        height: 50,
        borderTopRightRadius: borderRadius,
        borderTopLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,
    },
    products: {
        justifyContent: 'space-around',
        alignContent: 'baseline',
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 20,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 4, //IOS
        elevation: 8, // Android
        backgroundColor: lightGrey,
    },
    addButton:{
        justifyContent: 'flex-end', 
        flexDirection: 'row', 
        alignItems: 'baseline', 
        marginTop: -75, 
        marginBottom: 25, 
        marginRight: 10,
        marginLeft: 220,
    },
})

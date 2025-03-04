import React, { Component, useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, Platform, StatusBar, Alert} from "react-native";
import store from './store';
import { useSelector } from 'react-redux';

import db from "../firestore";
import { collection, addDoc } from "firebase/firestore";
import { globalUserID } from "./LogInScreen";

console.disableYellowBox = true;

const lightGrey = '#EEEEEE';
//const lightLightGrey = '#FAFAFA';
const borderRadius = 10;
{ var lightGreen = '#C3EEC9'; }
const lightLightGrey = '#F6F6F6'

const egg = [
    {"amount": 1, 
     "brand": "Uggelsta Ägg", 
     "discounted_price": 40, 
     "expiry_date": "2023-05-30", 
     "id": 10, 
     "image": "https://heliumcloud.s3.eu-north-1.amazonaws.com/haller-raa-agg-langre.jpg", 
     "name": "Ägg", 
     "price": 40, 
     "weight": ""}
]

export default function CartScreen() {
    const products = useSelector(state => state.products);
    const maxAmount = 30;
    const [total_cost, setCost] = useState(0);
    const [total_savings, setSavings] = useState(0);

    const [items, setItems] = useState([]);
    const [stock, setStock] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const getItems = async () => {
        try {
            const response = await fetch('http://ec2-13-50-248-6.eu-north-1.compute.amazonaws.com:8000/Item/items/');
            const json = await response.json();
            setItems(json)
        }

        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getItems();
    }, []);

    
        
    const getStock = async (url) => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            setStock(json)
        }

        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getStock();
    }, []);
   
    const increment = (product_i) => {
        if(product_i.amount < maxAmount){
            product_i.amount += 1;
            store.dispatch({type: 'UPDATE_PRODUCT', payload: product_i});
        }
    }

    const decrement = (product_i) => {
        if(product_i.amount > 1){
            product_i.amount -= 1; 
            store.dispatch({type: 'UPDATE_PRODUCT', payload: product_i});
        }
    }

    const remove_product = (product_i) => {
        store.dispatch({ type: 'REMOVE_PRODUCT', payload: product_i});
    }

    const removeEverything = () => {
        store.dispatch({ type: 'DELETE_PRODUCTS'});
    }

    const checkProductHasStock = async () => {
        await getItems(); // Fetch the items to get the updated version of the database
      
        if (products[0] && products.length > 0) {
          let hasStock = true; // Assume initially that all products have stock
      
          for (const p of products.flat()) {
            const product = items.find((item) => item.id === p.id);
            if (!product || product.stock < p.amount) {
              // If any product has insufficient stock or is not found, set hasStock to false
              hasStock = false;
              break; // Exit the loop immediately
            }
        }
            
        if(hasStock && products[0] && products.length > 0){            
            for (const p of products.flat()) {
                const product = items.find((item) => item.id === p.id);
            
                // Update the database
                const newAmount = product.stock - p.amount;
                const url ="http://ec2-13-50-248-6.eu-north-1.compute.amazonaws.com:8000/Item/changeAmount/" +p.id +"/" +newAmount +"/";
                await getStock(url);
                await getItems(); // Fetch the items to get the updated version of the database
            }
        }
        return hasStock;
        }
      };

      const processPurchase = async () => {

        const hasStock = await checkProductHasStock();

        if (hasStock) {
            createAlert();
            order = products;
            console.log('såhär ser products ut: ', products);
            console.log('såhär ser ordern ut: ', order);

            // Convert the nested array to an object
            const wares = {};
            for (let i = 0; i < products.length; i++) {
                wares[`item${i + 1}`] = products[i];
            }

            removeEverything();
            //skicka till firebase
            try {
                const docRef = await addDoc(collection(db, "userOrders"), {
                    id: globalUserID,
                    wares: wares,
                    createdAt: new Date(),
                });
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
        else {
            createAbort();
        }
    }

    useEffect(() => {
        const calculateSavings = () => {
            var price = 0;
            var discounted_price = 0;
            if(products[0] && products[0].length>0){
            products.flat().forEach((p) => {
                price += p.price*p.amount;
                discounted_price += p.discounted_price*p.amount;
            });
            }
            setSavings(price-discounted_price);
        }

        const calculateCost = () => {
            var price = 0;
            if(products[0] && products[0].length>0){
                products.flat().forEach((p) => {
                price += p.price*p.amount;
                });
            }
            setCost(price);
        }
        calculateCost();
        calculateSavings();
    }, [products]);
    
    const createAlert = () =>
    Alert.alert('Tack för köpet!', 'Butiken sätter ihop din kasse så snart som möjligt. En notifikation kommer skickas till dig när din kasse är redo.\n\nDu kan se ordern under din profil.​', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);

    
    const createAbort = () =>
    Alert.alert('Något gick tyvärr fel!', 'Någon av produkterna du har valt finns det tyvärr inte tillräckligt många av på lager. Testa igen senare\n\n Mvh BudgetBites.​', [
        {text: 'Avbryt köp', onPress: () => console.log('OK Pressed')},
    ]);

    //funktion som itererar genom varje index så många gånger som det finns element i arrayen products
    const renderProducts = () => {
        var products_views = [];
        if(products[0] && products.length>0){
            products.flat().forEach((p) => {
                products_views.push(renderProduct(p));
              });
        }
        return (products_views);
    }

    //funktion som returnerar en produkt givet ett index
    const renderProduct = (p) => {
        return(
            <View>
                <View style = {styles.product}>
                    <View style = {styles.image_placeholder}>
                        <Image
                            source={{ uri: p.image }}
                            style={styles.image_placeholder}
                        />
                    </View>

                    <View style = {{width: 120}}>
                        <Text style = {styles.productText} numberOfLines={2}>{p.name} {p.weight}, {p.brand} </Text>
                    </View>
        
                    <View style = {styles.antal}>
                        <Text style = {{flex: 1, padding: 3, marginLeft: 2, alignSelf: 'center'}}>{p.amount}</Text>

                        <View style = {{flex: 1, justifyContent: 'space-between', padding: 3}}>
                            <TouchableOpacity onPress= {() => {increment(p)}} style ={styles.increment_container}>
                            <Image
                                source= {require('../assets/upward_arrow.png')}
                                style={[styles.arrow, {}]}
                            />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {decrement(p)}} style = {styles.decrement_container}>
                                <Image
                                    source= {require('../assets/downward_arrow.png')}
                                    style={[styles.arrow, {}]}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style = {{width: 45}}>
                        <Text style={styles.old_prize}>{p.price} kr</Text>
                        <Text style = {styles.prize}>{p.discounted_price} kr</Text>
                    </View>
                </View>

                <TouchableOpacity onPress = {() => {remove_product(p)}} style = {styles.cross_container}>
                    <Image
                        source= {require('../assets/cross.png')}
                        style={styles.cross}
                    />
                </TouchableOpacity>
            </View>
            
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, margin: 15, justifyContent: 'center', marginBottom: 10, }}>
                <View style = {styles.opacity1}>
                    <Text style={styles.header}>Varukorg</Text>
                </View>
                <Text style={[styles.textStyle, { marginLeft: 30, paddingBottom: 15 }]}>Coop</Text>
            </View>

            {/* <TouchableOpacity 
                onPress={() => {
                    store.dispatch({ type: 'SET_PRODUCT', payload: egg, amount:1});  //KANSKE SKA SKICKA MED item.name?
                }}
                style = {styles.product}>
                <Text>Lägg till produkt (för test)</Text>
            </TouchableOpacity> */}

            {/* <TouchableOpacity 
                onPress = {() => {add_product(product2)}}
                style = {styles.product}>
                <Text>Lägg till en till produkt (för test)</Text>
            </TouchableOpacity> */}

            <View style = {styles.scrollContainer}>
                <ScrollView 
                    contentContainerStyle = {{alignItems: 'center'}}
                    style = {styles.scrollView}>
                    {renderProducts()}
                </ScrollView>
            </View>

            <View style={styles.total_cost}>
                <Text style={styles.textStyle}>Total kostnad: {total_cost}</Text>
                <Text style={styles.textStyle}>Du sparar: {total_savings}</Text>
            </View>

            <TouchableOpacity
                style={styles.swishButton}
                onPress={() => {processPurchase()}}
            >
                <Text style={styles.textStyle} >Betala med    </Text>
                <Image
                    source={require('../assets/swish.png')}
                    style={styles.swish}
                />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    swish: {
        resizeMode: 'contain',
        width: 100,
        height: 30,
    },
    swishButton: {
        paddingLeft: 25,
        paddingRight: 25,
        padding: 13,
        borderRadius: 35,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 4, //IOS
        elevation: 8, // Android
        borderColor: 'green',
        borderWidth: 2,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 80
    },
    textStyle: {
        color: 'black',
        fontSize: 16,
    },
    product: {
        backgroundColor: lightLightGrey,
        margin: 7,
        width: '90%',
        height: 80,
        alignItems: 'center',
        borderRadius: borderRadius,
        flexDirection: "row",
        justifyContent: 'space-evenly',
        paddingRight: 25,
    },
    header: {
        color: 'black',
        fontSize: 22,
        fontWeight: 'bold',
    },
    cross: {
        resizeMode: 'contain',
        width: 18,
        height: 18,
    },
    image_placeholder: {
        backgroundColor: '#ffffff',
        width: 65,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    antal: {
        backgroundColor: '#ffffff',
        width: 50,
        height: 55,
        borderRadius: 2,
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'row',
    },
    prize: {
        color: 'green',
    },
    old_prize: {
        textDecorationLine: 'line-through', 
        textDecorationStyle: 'solid',
        fontStyle: 'italic',
        color: 'red',
    },
    arrow: {
        width: 13,
        resizeMode: 'contain',
        height: 13,
        padding: 2
    },
    total_cost: {
        flexDirection: 'row', 
        width: '90%', 
        justifyContent: 'space-between', 
        padding: 30,
        position: 'absolute',
        bottom: 125,
    },
    scrollView: { //TA EV BORT
        //marginBottom: 20,
        //backgroundColor: lightGrey,
    },
    scrollContainer: {
        marginBottom: 200,
        width: '100%',
        flex: 1,
        //backgroundColor: lightLightGrey,
    },
    productText: {
        fontSize: 12
    },
    cross_container: {
        width: 35,
        height: 40,
        position: 'absolute',
        right: 10,
        bottom: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    decrement_container: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'flex-end',
        right:9,
        paddingBottom: 6,
        bottom: 5
    },
    increment_container: {
        width: 30,
        height: 30,
        alignItems: 'center',
        right:9,
        top:-5,
        paddingTop: 5,
    },
    opacity1: {
        backgroundColor: lightGreen,
        width: '50%',
        borderRadius: borderRadius,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 20,
    },
})

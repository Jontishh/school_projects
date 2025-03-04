import React, { Component, useState } from "react";
import { StyleSheet, View, Text, Image, SafeAreaView, ScrollView, Platform, StatusBar} from "react-native";

const lightGrey = '#EEEEEE';
const borderRadius = 10;
const lightLightGrey = '#F6F6F6'

console.disableYellowBox = true;

export default function OrderXScreen({route}) {

    const { order, date } = route.params;

    const renderOrder = () => {
        var orders_views = [];
        console.log('det här är en order', order);
        if(Object.keys(order).length>0){
            for (const product in order) {
                orders_views.push(renderProduct(order[product][0]));
            }
        }
        return (orders_views);
    }

    const renderProduct = (p) => {
        return(
            <View style = {styles.product}>
                <View style = {styles.image_placeholder}>
                    <Image
                        source={{ uri: p.image }}
                        style={styles.image_placeholder}
                    />
                </View>

                <View style = {{width: 120}}>
                    <Text style = {styles.productText} numberOfLines={2}>{p.name} {p.weight}, {p.brand}</Text>
                </View>
                <View style = {styles.antal}>
                    <Text>{p.amount} st</Text>
                </View>
                <View style>
                    <Text style={styles.old_prize}>{p.price} kr</Text>
                    <Text style = {styles.prize}>{p.discounted_price} kr</Text>
                </View>
            </View>
        )
    }

    const calculateSavings = () => {
        var price = 0;
        var discounted_price = 0;
        if(Object.keys(order).length>0){
            for (const product_id in order) {
                const p = order[product_id][0];
                price += p.price*p.amount;
                discounted_price += p.discounted_price*p.amount
            }
        }
        return(price-discounted_price);
    }

    const calculateCost = () => {
        var price = 0;
        if(Object.keys(order).length>0){
            for (const product_id in order) {
                const p = order[product_id][0];
                price += p.price*p.amount;
            }
        }
        return(price);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style = {{flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, margin: 15}}>
                <Text style = {styles.header}>{date}</Text>
                <Text style = {[styles.textStyle, {marginLeft: 50}]}>Coop</Text>
            </View>
            <View style = {styles.scrollContainer}>
                <ScrollView 
                    contentContainerStyle = {{alignItems: 'center'}}
                    style = {styles.scrollView}>
                    {renderOrder()}
                </ScrollView>
            </View>
            <View style = {styles.total_cost}>
                <Text style = {styles.textStyle}>Totalt: {calculateCost()} kr</Text>
                <Text style = {styles.textStyle}>Du sparade: {calculateSavings()} kr</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
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
    },
    header: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
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
        width: 10,
        resizeMode: 'contain',
        height: 10,
        padding: 2
    },
    total_cost: {
        flexDirection: 'row', 
        width: '90%', 
        justifyContent: 'space-between', 
        padding: 30,
        position: 'absolute',
        bottom: 45
    },
    scrollView: { //TA EV BORT
        //marginBottom: 220,
    },
    scrollContainer: {
        marginBottom: 120,
        width: '100%',
        flex: 1,
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
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
})

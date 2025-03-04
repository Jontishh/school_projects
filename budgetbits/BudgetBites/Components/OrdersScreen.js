//import React from "react";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import store from './store';

import db from "../firestore";
import { collection, query, getDocs, where } from "firebase/firestore";
import { globalUserID } from "./LogInScreen";

console.disableYellowBox = true;

{ var lightGreen = '#C3EEC9'; }
{ var borderRadius = 10; }
const lightLightGrey = '#F6F6F6'
const butik = 'Coop';

export default function OrdersScreen({ navigation }) {
    const [orders, setOrders] = useState([]);
    const [orderDates, setOrderDates] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const q = query(collection(db, 'userOrders'), where('id', '==', globalUserID));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    let date = [];
                    let wares = [];
                    querySnapshot.forEach((doc) => {
                        const orderDate = doc.data().createdAt.toDate();
                        const formattedDate = orderDate.toLocaleDateString();

                        const waresData = doc.data().wares;

                        wares.push(waresData);
                        date.push(formattedDate);
                    });
                    
                    setOrders(wares);
                    setOrderDates(date);
                } else {
                    console.log('Could not find doc for user orders');
                }
            } catch (error) {
                console.log('Error fetching user orders:', error);
            }
        };
        fetchOrders();
    }, []);

    const renderOrder = (order, index) => {
        return (
            <View>
                <TouchableOpacity
                    style={[styles.order, styles.shadow]}
                    onPress={() => navigation.navigate('OrderX', { order: order, date: orderDates[0] })}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', flex: 1 }}>
                        <Text>{orderDates[0]}</Text>
                        <Text>{butik}</Text>
                        <Text>{Object.keys(order).length}  varor</Text>
                    </View>
                    <Image
                        source={require('../assets/forward_arrow_green.png')}
                        style={[styles.arrow, { width: 16 }]}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    const renderOrders = () => {
        var orders_views = [];
        console.log('det här är orders[0]', orders[0])
        var index = 0;
        if (orders[0] && orders.length > 0) {
            orders.flat().forEach((p) => {
                orders_views.push(renderOrder(p, index));
                index ++;
            });
        }
        console.log(orders_views.length);
        return (orders_views);
    }

    const { products } = store.getState();
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                <View style={styles.opacity1}>
                    <Text style={styles.header} >
                        Ordrar
                    </Text>
                </View>
                {renderOrders()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    opacity1: {
        backgroundColor: lightGreen,
        width: '60%',
        borderRadius: borderRadius,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    temp: {
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        top: 150,
        padding: 50,
    },
    order: {
        backgroundColor: lightLightGrey,
        margin: 7,
        width: '90%',
        height: 50,
        alignItems: 'center',
        borderRadius: borderRadius,
        flexDirection: "row",
        justifyContent: 'space-evenly',
        paddingRight: 25,
    },
    shadow: {
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 2, // Android
    },
    header: {
        color: 'black',
        fontSize: 22,
        fontWeight: 'bold',
    },
    arrow: {
        resizeMode: 'contain',
        width: 15,
        height: 20,
        position: "absolute",
        right: 20,
    },
})

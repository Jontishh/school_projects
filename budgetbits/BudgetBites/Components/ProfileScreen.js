import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Image, TextInput, Modal, Alert, ScrollView, Platform, StatusBar } from "react-native";
import Checkbox from 'expo-checkbox';
// import store from './store';

import db from "../firestore";
import { collection, query, getDocs, where } from "firebase/firestore";
import { globalUserID } from "./LogInScreen";

console.disableYellowBox = true;

const borderRadius = 10;
const lightLightGrey = '#F6F6F6'
const lightGreen = '#C3EEC9';
const trueGreen = '#01be12';
const checkboxColor = trueGreen;

export default function ProfileScreen({ navigation }) {

    const [isCheckedLaktos, setCheckedLaktos] = useState(false);
    const [isCheckedVegansk, setCheckedVegansk] = useState(false);
    const [isCheckedVegetarisk, setCheckedVegetarisk] = useState(false);
    const [isCheckedGluten, setCheckedGluten] = useState(false);

    const [isCheckedSms, setCheckedSms] = useState(false);
    const [isCheckedEmail, setCheckedEmail] = useState(false);
    const [isCheckedPush, setCheckedPush] = useState(false);

    const [showDropdown, setDropdown] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [showDropdownNotice, setDropdownNotice] = useState(false);

    const [name, setName] = useState('Exempel Exempelsson');
    const [email, setEmail] = useState('exempel@gmail.com');
    const [country, onChangeCountry] = useState('Sverige');
    const [number, onChangeNumber] = useState('0700520055');

    useEffect(() => {
        updateNameAndEmail().then((updatedData) => {
            if (updatedData) {
                setName(updatedData.name);
                setEmail(updatedData.email);
            }
        });
    }, []);

    const fetchUserData = async () => {
        try {
            const q = query(collection(db, "userData"), where("id", "==", globalUserID));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                let userData;
                querySnapshot.forEach((doc) => {
                    userData = doc.data();
                });
                return userData;
            } else {
                console.log("Could not find doc for user data");
                return null;
            }
        } catch (error) {
            console.log("Error updating user data:", error);
        }
    };

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const q = query(collection(db, 'userOrders'), where('id', '==', globalUserID));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    let date = [];
                    let wares = [];
                    querySnapshot.forEach((doc) => {
                        const waresData = doc.data().wares;
                        wares.push(waresData);
                    });                  
                    setOrders(wares);
                } else {
                    console.log('Could not find doc for user orders');
                }
            } catch (error) {
                console.log('Error fetching user orders:', error);
            }
        };
        fetchOrders();
    }, []);

    const calculateCostOrders = () => {
        var totalCost = 0;
        if (orders[0] && orders.length > 0) {
            orders.flat().forEach((order) => {
                totalCost += calculateCostOrder(order);
            });
        }
        return totalCost;
    }

    const calculateCostOrder = (order) => {
        var price = 0;
        if(Object.keys(order).length>0){
            for (const product_id in order) {
                const p = order[product_id][0];
                price += p.price*p.amount;
            }
        }
        return(price);
    }

    const updateNameAndEmail = async () => {
        const data = await fetchUserData();
        if (data) {
            return { name: data.name, email: data.email };
        } else {
            return null;
        }
    }

    renderDropdown = () => {
        if (showDropdown) {
            return (
                <View style={[styles.dropdown, styles.shadow]}>
                    <View style={styles.section}>
                        <Checkbox
                            style={styles.checkbox}
                            value={isCheckedVegansk}
                            onValueChange={setCheckedVegansk}
                            color={isCheckedVegansk ? checkboxColor : undefined}
                        />
                        <Text>Vegansk</Text>
                    </View>
                    <View style={styles.section}>
                        <Checkbox
                            style={styles.checkbox}
                            value={isCheckedVegetarisk}
                            onValueChange={setCheckedVegetarisk}
                            color={isCheckedVegetarisk ? checkboxColor : undefined}
                        />
                        <Text>Vegetarisk</Text>
                    </View>
                    <View style={styles.section}>
                        <Checkbox
                            style={styles.checkbox}
                            value={isCheckedGluten}
                            onValueChange={setCheckedGluten}
                            color={isCheckedGluten ? checkboxColor : undefined}
                        />
                        <Text>Glutenfri</Text>
                    </View>
                    <View style={styles.section}>
                        <Checkbox
                            style={styles.checkbox}
                            value={isCheckedLaktos}
                            onValueChange={setCheckedLaktos}
                            color={isCheckedLaktos ? checkboxColor : undefined}
                        />
                        <Text>Laktosfri</Text>
                    </View>
                </View>)
        }
    }

    renderDropdownNotice = () => {
        if (showDropdownNotice) {
            return (<View style={[styles.dropdown, styles.shadow]}>
                <Text style={{ margin: 8, marginLeft: 8 }}>Skicka bekräftelse via: </Text>
                <View style={styles.section}>
                    <Checkbox
                        style={styles.checkbox}
                        value={isCheckedEmail}
                        onValueChange={setCheckedEmail}
                        color={isCheckedEmail ? checkboxColor : undefined}
                    />
                    <Text>Email</Text>
                </View>
                <View style={styles.section}>
                    <Checkbox
                        style={styles.checkbox}
                        value={isCheckedSms}
                        onValueChange={setCheckedSms}
                        color={isCheckedSms ? checkboxColor : undefined}
                    />
                    <Text>Sms</Text>
                </View>
                <View style={styles.section}>
                    <Checkbox
                        style={styles.checkbox}
                        value={isCheckedPush}
                        onValueChange={setCheckedPush}
                        color={isCheckedPush ? checkboxColor : undefined}
                    />
                    <Text>Pushnotis</Text>
                </View>
            </View>)
        }
    }

    renderArrow = () => {
        if (showDropdown) {
            return (<Image
                source={require('../assets/upward_arrow_green.png')}
                style={styles.arrow}
            />)
        }
        else {
            return (<Image
                source={require('../assets/downward_arrow_green.png')}
                style={styles.arrow}
            />)
        }
    }

    renderArrowNotice = () => {
        if (showDropdown) {
            return (<Image
                source={require('../assets/upward_arrow_green.png')}
                style={styles.arrow}
            />)
        }
        else {
            return (<Image
                source={require('../assets/downward_arrow_green.png')}
                style={styles.arrow}
            />)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={{ alignItems: 'center' }}
            >
                <View style={[styles.savings]}>
                    <Image
                        source={require('../assets/money.png')}
                        style={styles.money_icon}
                    />
                    <Image
                        source={require('../assets/money2.png')}
                        style={styles.money_icon2}
                    />
                    <Text>Du har sparat totalt:  {calculateCostOrders()} kr!</Text>
                </View>

                <View style={{ width: '80%', paddingLeft: 10, flexDirection: "row", alignContent: 'center' }}>
                    <Text style={{ margin: 0 }}>Kontouppgifter</Text>
                    <TouchableOpacity
                        style={styles.edit}
                        onPress={() => setModalVisible(true)}
                    >
                        <Image
                            source={require('../assets/edit_green.png')}
                            style={styles.edit}
                        />
                    </TouchableOpacity>
                </View>

                <View style={[styles.profile, styles.shadow]}>
                    <View style={{ flex: 2, left: 20, paddingTop: 15, paddingBottom: 15, justifyContent: "space-evenly" }}>
                        <Text>Namn</Text>
                        <Text>E-mail</Text>
                        <Text>Telefon</Text>
                        <Text>Land</Text>
                    </View>
                    <View style={{ flex: 3, paddingTop: 15, paddingBottom: 15, justifyContent: "space-evenly" }}>
                        <Text numberOfLines={1}>{name}</Text>
                        <Text numberOfLines={1}>{email}</Text>
                        <Text numberOfLines={1}>{number}</Text>
                        <Text numberOfLines={1}>{country}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.dropdownTop, styles.shadow]}
                    onPress={() => setDropdown(!showDropdown)}
                >
                    <Text>Matpreferenser</Text>
                    {renderArrow()}
                </TouchableOpacity>

                {renderDropdown()}

                <TouchableOpacity
                    style={[styles.dropdownTop, { marginTop: 20 }, styles.shadow]}
                    onPress={() => setDropdownNotice(!showDropdownNotice)}>
                    <Text>Notisinställningar</Text>
                    {renderArrowNotice()}
                </TouchableOpacity>

                {renderDropdownNotice()}

                <TouchableOpacity style={[styles.button, { marginTop: 20 }]}>
                    <Text>Platsinställningar</Text>
                    <Image
                        source={require('../assets/forward_arrow_green.png')}
                        style={styles.arrow}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Orders')}
                >
                    <Text>Ordrar</Text>
                    <Image
                        source={require('../assets/forward_arrow_green.png')}
                        style={[styles.arrow, { width: 16 }]}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('LogIn')}>
                    <Text>Logga ut</Text>
                    <Image
                        source={require('../assets/forward_arrow_green.png')}
                        style={[styles.arrow, { width: 16 }]}
                    />
                </TouchableOpacity>

                <View style={styles.centeredView}>
                    <Modal
                        //animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setModalVisible(!modalVisible);
                        }}>
                        <View style={styles.modalView}>
                            <Text style={styles.textStyle}>Ändra profiluppgifter</Text>
                            <View style={[styles.edit_profile]}>
                                <View style={[styles.edit_profile2, { justifyContent: 'space-between' }]}>
                                    <Text>Namn</Text>
                                    <TextInput
                                        style={styles.input}
                                        //onChangeText={onChangeName}
                                        value={name}
                                    />
                                </View>
                                <View style={[styles.edit_profile2, { justifyContent: 'space-between' }]}>
                                    <Text>E-mail</Text>
                                    <TextInput
                                        style={styles.input}
                                        //onChangeText={onChangeEmail}
                                        value={email}
                                    />
                                </View>
                                <View style={[styles.edit_profile2, { justifyContent: 'space-between' }]}>
                                    <Text>Telefon</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={onChangeNumber}
                                        value={number}
                                        //placeholder="useless placeholder"
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={[styles.edit_profile2, { justifyContent: 'space-between' }]}>
                                    <Text>Land</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={onChangeCountry}
                                        value={country}
                                    />
                                </View>
                            </View>
                            <TouchableOpacity
                                style={[styles.button, { justifyContent: 'center', paddingLeft: 0, backgroundColor: lightGreen, width: '50%' }]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text>Spara</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            </ScrollView>
            <View style={{ height: 50 }} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingTop: 20
    },
    savings: {
        backgroundColor: lightGreen,
        width: '80%',
        borderRadius: borderRadius,
        height: 50,
        marginBottom: 25,
        //marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    profile: {
        width: '80%',
        height: 150,
        flexDirection: "row",
        backgroundColor: lightLightGrey,
        marginBottom: 20,
        margin: 10,
        paddingRight: 15,
        borderRadius: borderRadius,
    },
    button: {
        backgroundColor: lightLightGrey,
        margin: 10,
        width: '80%',
        height: 40,
        alignItems: 'center',
        borderRadius: borderRadius,
        flexDirection: "row",
        paddingLeft: 20,

        //to make a shadow
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 2, // Android
    },
    arrow: {
        resizeMode: 'contain',
        width: 15,
        height: 20,
        position: "absolute",
        right: 20,
    },
    edit: {
        resizeMode: 'contain',
        width: 20,
        height: 20,
        position: "absolute",
        right: 7,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
    },
    checkbox: {
        margin: 8,
    },
    dropdown: {
        backgroundColor: 'white',
        marginBottom: 0,
        paddingTop: 10,
        width: '80%',
        height: 170,
        borderBottomRightRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,
        paddingLeft: 12,
    },
    dropdownTop: {
        backgroundColor: lightLightGrey,
        marginTop: 10,
        width: '80%',
        height: 40,
        alignItems: 'center',
        borderRadius: borderRadius,
        flexDirection: "row",
        paddingLeft: 20,
    },
    money_icon2: {
        width: 35,
        height: 35,
        position: "absolute",
        left: 30,
        top: 9
    },
    money_icon: {
        width: 35,
        height: 35,
        position: "absolute",
        right: 30,
        top: 9
    },
    shadow: {
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 2, // Android
    },

    //för popup-fönster edit
    modalView: {
        margin: 25,
        backgroundColor: 'white',
        borderRadius: borderRadius,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        top: 130,
        paddingBottom: 10,

        //skugga
        shadowOffset: {
            width: 0,
            height: 2,
            top: 100,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 30,
        borderWidth: 1,
        paddingLeft: 10,
        borderRadius: 5,
        width: 225,
        borderColor: 'green',
        //alignSelf: 'right',
    },
    edit_profile: {
        width: '100%',
        height: 160,
        marginBottom: 10,
        marginTop: 15,
        borderRadius: borderRadius,
        alignContent: 'center',
    },
    edit_profile2: {
        width: '100%',
        height: 40,
        alignItems: 'center',
        borderRadius: borderRadius,
        flexDirection: "row",
    },
    textStyle: {
        color: 'black',
        fontSize: 17,
    },
    scrollView: {
        width: '100%',
        height: '100%',
    },
})

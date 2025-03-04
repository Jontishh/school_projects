import React from "react";
import { StyleSheet, TouchableOpacity, View, Text, ImageBackground, Image, Button } from "react-native";

import * as Google from 'expo-auth-session/providers/google';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';

import db from "../firestore";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

export let globalUserID = undefined;

console.disableYellowBox = true;

export default function LogInScreen({ navigation }) {

    // Define state variables using the useState hook.
    const [userInfo, setUserInfo] = useState(undefined);
    const [auth, setAuth] = useState(undefined);
    const [requireRefresh, setRequireRefresh] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: "626318363822-a8ea8pbik85uk46o3injpsn6h7no71id.apps.googleusercontent.com",
        iosClientId: "626318363822-i4dv50jijef5pvg0vof8id98ht3ljq47.apps.googleusercontent.com",
        expoClientId: "626318363822-0p0ro216qs38pl9dhcu829c4coej7b3j.apps.googleusercontent.com"
    });


    // Call the useEffect hook to set the auth state variable to the authentication response obtained from Google then,
    // retrieves the user's data from Google API, saves the authentication token to local storage, 
    // and writes the user's data to the Firestore database
    useEffect(() => {
        if (response?.type === "success") {
            const tempAuth = response.authentication;
            setAuth(tempAuth);
            console.log(tempAuth);

            const persistAuth = async () => {
                await AsyncStorage.setItem("auth", JSON.stringify(response.authentication));
            };
            persistAuth();

            // self-invoking async function
            (async () => {
                try {
                    const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
                        headers: { Authorization: `Bearer ${tempAuth.accessToken}` },
                    });
                    const userData = await response.json();
                    console.log(userData);
                    setUserInfo(userData);

                    const userExists = async (userData) => {
                        const q = query(collection(db, "userData"), where("id", "==", userData.id));
                        const querySnapshot = await getDocs(q);
                        return !querySnapshot.empty;
                    };

                    if (await userExists(userData)) {
                        console.log("user exists");
                    } else {
                        console.log("user doesn't exists");
                        try {
                            const docRef = await addDoc(collection(db, "userData"), {
                                name: userData.name,
                                email: userData.email,
                                id: userData.id,
                                accessToken: tempAuth.accessToken,
                                createdAt: new Date(),
                            });
                            console.log("Document written with ID: ", docRef.id);
                        } catch (e) {
                            console.error("Error adding document: ", e);
                        }
                    }

                    globalUserID = userData.id;
                    console.log("globalUserID: ", globalUserID);

                } catch (error) {
                    console.error(error);
                }
            })();
        }
    }, [response]);


    // Call the useEffect hook to get persisted authentication data and set the auth and requireRefresh state variables.
    useEffect(() => {
        const getPersistedAuth = async () => {
            const jsonValue = await AsyncStorage.getItem("auth");
            if (jsonValue != null) {
                const authFromJson = JSON.parse(jsonValue);
                setAuth(authFromJson);
                console.log(authFromJson);

                setRequireRefresh(authFromJson.refreshToken && !AuthSession.TokenResponse.isTokenFresh({
                    expiresIn: authFromJson.expiresIn,
                    issuedAt: authFromJson.issuedAt
                }));
            }
        };
        getPersistedAuth();
    }, []);

    // Revoke the access token and remove the authentication data from AsyncStorage.
    const logout = async () => {
        await AuthSession.revokeAsync({
            token: auth.accessToken
        }, {
            revocationEndpoint: "https://oauth2.googleapis.com/revoke"
        });

        setAuth(undefined);
        setUserInfo(undefined);
        await AsyncStorage.removeItem("auth");
    };

    // Handles the navigation to the 'Butiker' screen
    const handleNavigation = () => {
        navigation.navigate('Butiker');
    };

    // Handles the Google Sign In by calling the 'promptAsync' method
    const handleGoogleSignIn = () => {
        promptAsync({ useProxy: true, showInRecents: true });
    };

    return (
        <ImageBackground
            source={require('../assets/background.png')}
            style={styles.background}
        >
            <View style={styles.content}>
                <Image
                    source={require('../assets/BudgetBites.png')}
                    style={styles.logo}
                />
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={auth ? handleNavigation : handleGoogleSignIn}>

                    <Image
                        source={require('../assets/Google.png')}
                        style={{ width: 25, height: 25 }} />
                    <Text style={styles.textStyle} >  Fortsätt med Google</Text>

                </TouchableOpacity>
                {auth ? <Button title="Logga ut" onPress={logout} /> : undefined}

            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    logo: {
        resizeMode: 'contain',
        width: 300,
        height: 300,
    },
    content: {
        flex: 1,
        marginTop: 100,
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    loginButton: {
        paddingLeft: 30,
        paddingRight: 30,
        padding: 20,
        borderRadius: 30,
        flexDirection: 'row',
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 4, //IOS
        elevation: 8, // Android
        borderColor: 'green',
        borderWidth: 4,
        backgroundColor: '#ffffff',
        marginTop: 0
    },
    textStyle: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
import react from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { StyleSheet, View, Image, Text, ColorValue, TouchableOpacity } from "react-native";

import HomeScreen from '../Components/HomeScreen';
import FavoritesScreen from '../Components/FavoritesScreen';
import ProfileScreen from '../Components/ProfileScreen';
import CartScreen from '../Components/CartScreen';
import LogInScreen from '../Components/LogInScreen';
import OrderXScreen from '../Components/OrderXScreen';
import OrdersScreen from '../Components/OrdersScreen';
import StoreScreen from '../Components/StoreScreen';
import RecipeScreen from '../Components/RecipeScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const FavoriteStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

console.disableYellowBox = true;

{ var defaultColor = '#01be12'; }     // Default color
{ var secondaryColor = '#656965'; }   // Secondary color

const HomeStackScreens = () => {
    return (
        <HomeStack.Navigator
            screenOptions={{
                title: ' ',
                headerTintColor: defaultColor,
                headerTransparent: true,
            }}>
            <HomeStack.Screen name="Home" component={HomeScreen} />
            <HomeStack.Screen name="Store" component={StoreScreen} />
            <HomeStack.Screen name="Recipe" component={RecipeScreen} />

        </HomeStack.Navigator>
    );
};

const FavoriteStackScreens = () => {
    return (
        <FavoriteStack.Navigator
            screenOptions={{
                title: ' ',
                headerTintColor: defaultColor,
                headerTransparent: true,
            }}>
            <FavoriteStack.Screen name="Favorites" component={FavoritesScreen} />
            <FavoriteStack.Screen name="Store" component={StoreScreen} />
            <FavoriteStack.Screen name="Recipe" component={RecipeScreen} />

        </FavoriteStack.Navigator>
    );
};

const ProfileStackScreens = () => {
    return (
        <ProfileStack.Navigator
            screenOptions={{
                title: ' ',
                headerTintColor: defaultColor,
                headerTransparent: true,
            }}>
            <ProfileStack.Screen name="Profile" component={ProfileScreen} />
            <ProfileStack.Screen name="Orders" component={OrdersScreen} />
            <ProfileStack.Screen name="OrderX" component={OrderXScreen} />

        </ProfileStack.Navigator>
    );
};

const Tabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: { position: 'absolute', },
                tabBarBackground: () => (
                    <View style={{ backgroundColor: 'white', ...StyleSheet.absoluteFill }} />
                ),
            }}>

            <Tab.Screen
                name="LogIn"
                component={LogInScreen}
                options={{
                    tabBarStyle: { display: 'none', },
                    tabBarButton: (props) => null,
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', top: 3 }}>
                            <Image
                                source={require('../assets/favicon.png')}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? defaultColor : secondaryColor
                                }}
                            />
                            <Text
                                style={{ color: focused ? defaultColor : secondaryColor, fontSize: 12 }}>
                                LogIn
                            </Text>
                        </View>
                    ),
                }} />

            <Tab.Screen
                name="Butiker"
                component={HomeStackScreens}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', top: 3 }}>
                            <Image
                                source={require('../assets/store.png')}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? defaultColor : secondaryColor
                                }}
                            />
                            <Text
                                style={{ color: focused ? defaultColor : secondaryColor, fontSize: 12 }}>
                                Butiker
                            </Text>
                        </View>
                    ),
                }} />

            <Tab.Screen
                name="Favoriter"
                component={FavoriteStackScreens}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', top: 3 }}>
                            <Image
                                source={require('../assets/favorite.png')}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? defaultColor : secondaryColor
                                }} />
                            <Text
                                style={{ color: focused ? defaultColor : secondaryColor, fontSize: 12 }}>
                                Favoriter
                            </Text>
                        </View>
                    ),
                }} />

            <Tab.Screen
                name="Profil"
                component={ProfileStackScreens}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', top: 3 }}>
                            <Image
                                source={require('../assets/profile.png')}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? defaultColor : secondaryColor
                                }} />
                            <Text
                                style={{ color: focused ? defaultColor : secondaryColor, fontSize: 12 }}>
                                Profil
                            </Text>
                        </View>
                    ),
                }} />

            <Tab.Screen
                name="Varukorg"
                component={CartScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', top: 3 }}>
                            <Image
                                source={require('../assets/cart.png')}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? defaultColor : secondaryColor
                                }} />
                            <Text
                                style={{ color: focused ? defaultColor : secondaryColor, fontSize: 12 }}>
                                Varukorg
                            </Text>
                        </View>
                    ),
                }} />
        </Tab.Navigator>
    );
}

export default Tabs;
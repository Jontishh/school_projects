import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, SafeAreaView, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { useIsFocused } from '@react-navigation/native'
import './global.js'

{ var borderRadius = 10; }
{ var lightGrey = '#EEEEEE'; }
{ var darkGrey = '#5A5A5A'; }
{ var defaultColor = '#01be12'; }

export default function FavoritesScreen({ navigation }) {
    const [isLoading, setLoading] = useState(true);
    const [recipes, setRecipes] = useState([])
    const [favRecipes, setFavRecipes] = useState([])
    const [selectedIndices, setSelectedIndices] = useState(global.Favorites);

    const Favorites = (allRecipes) => {
        console.log(global.Favorites)
        return allRecipes.filter(item => {
            if (global.Favorites.includes(item.id)) {
                return item.id
            }
        })
    }

    const getRecipe = async () => {
        try {
            const response = await fetch('http://ec2-13-50-248-6.eu-north-1.compute.amazonaws.com:8000/Recipe/all');
            const json = await response.json();
            setRecipes(json)
            setFavRecipes(Favorites(json))
        }

        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getRecipe();
    }, []);

    const isFocused = useIsFocused()

    useEffect(() => {
        if (isFocused) {
            setFavRecipes(Favorites(recipes))
            setSelectedIndices(global.Favorites)
        }
    }, [isFocused])

    return (
        <View style={styles.container}>
            <View style={styles.container2}>
                <Image
                    source={require('../assets/StarIcon.png')}
                    style={styles.logo}
                />
                <Text style={styles.title}>
                    Favoritrecept
                </Text>
            </View>
            <SafeAreaView style={styles.allProducts}>
                {isLoading ? (
                    <ActivityIndicator />
                ) : (
                    <FlatList
                        data={favRecipes}
                        keyExtractor={({ id }) => id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={
                                    [
                                        styles.recipes,
                                        item.category === 'Kött'
                                            ? { borderColor: '#ff726f' }
                                            : item.category === 'Fisk'
                                                ? { borderColor: '#35B7F4' }
                                                : item.category === 'Vegetarisk'
                                                    ? { borderColor: '#26AB18' }
                                                    : { borderColor: darkGrey } // default borderColor
                                    ]}
                                onPress={() => navigation.navigate('Recipe', { recipeId: item.id })}>
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.logoRecipe} />
                                <Text style={styles.txtStyleRecipe}>
                                    {item.name}
                                </Text>

                                {/* LIKE A RECIPE */}
                                <TouchableOpacity
                                    style={{ marginBottom: 10, marginLeft: 80 }}
                                    onPress={() => {
                                        var result = selectedIndices
                                        const isSelected = selectedIndices.includes(item.id);
                                        if (isSelected) {
                                            result = selectedIndices.filter(i => i !== item.id)
                                            setSelectedIndices(result)
                                        } else {
                                            result = [...selectedIndices, item.id]
                                            setSelectedIndices(result)
                                        }
                                        global.Favorites = result
                                        setFavRecipes(Favorites(recipes))
                                    }}>
                                    <Image
                                        source={require('../assets/favorite.png')}
                                        style={[styles.starIcon, selectedIndices.includes(item.id) && { tintColor: defaultColor }]} />
                                </TouchableOpacity>
                            </TouchableOpacity>

                        )}

                    />
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        marginBottom: 40,
        flex: 1,
        alignItems: 'center',
        //justifyContent: 'baseline',
        backgroundColor: '#ffffff',
    },
    container2: {
        padding: 10,
        directions: 'rtl',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 15,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    logo: {
        width: 50,
        height: 50,
    },
    starIcon: {
        marginLeft: 230,
        //paddingRight: 34,,
        marginRight: 20,
        alignItems: 'center',
        flexDirection: 'row',
        tintColor: 'darkgrey',
        width: 30,
        height: 30,
    },
    logoRecipe: {
        marginLeft: 10,   //Margins to controll that the picture gets in the right position
        marginTop: 10,
        marginBottom: -90,
        width: 100,
        height: 100,
        borderTopRightRadius: borderRadius,
        borderTopLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,
    },
    txtStyleRecipe: {
        fontWeight: 'bold',
        padding: 10,
        marginBottom: 20,
        marginLeft: 110,
    },
    recipes: {
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
        borderWidth: 2,
        backgroundColor: lightGrey,
        //width: '80%',
    },
})
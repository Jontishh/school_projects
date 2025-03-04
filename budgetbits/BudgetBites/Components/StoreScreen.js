import React, { useEffect, useState } from "react";
import { StyleSheet, Dimensions, View, Text, ActivityIndicator, FlatList, Image, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchBar } from 'react-native-elements';
import { useIsFocused } from '@react-navigation/native'
import store from './store';
import './global.js'

console.disableYellowBox = true;


{ var borderRadius = 10; }
{ var lightGrey = '#EEEEEE'; }
{ var darkGrey = '#5A5A5A'; }
{ var defaultColor = '#01be12'; }     // Default color that is green


export default function ProductScreen({ route, navigation }) {
    const [isLoading, setLoading] = useState(true);
    const [showDropdown, setDropdown] = useState(false);
    const [page, setShow] = useState(1);

    const [allRecipes, setAllRecipes] = useState([])
    const [filterRecipes, setFilterRecipes] = useState([])
    const [recipes, setRecipes] = useState([]);
    const [searchRecipe, setSearchRecipe] = useState("");

    const [items, setItems] = useState([]);
    const [allItems, setAllItems] = useState([])
    const [searchItem, setSearchItem] = useState("");

    const [pressedIndex, setPressedIndex] = useState(null);
    const [selectedIndices, setSelectedIndices] = useState(global.Favorites);
    const { storeTitle } = route.params;

    const [selectedValue, setSelectedValue] = useState("java");

    const handlePress = (index) => {
        setPressedIndex(index);
    };

    const isFocused = useIsFocused()

    useEffect(() => {
        if (isFocused) {
            setSelectedIndices(global.Favorites)
        }
    }, [isFocused])

    const getItems = async () => {
        try {
            const response = await fetch('http://ec2-13-50-248-6.eu-north-1.compute.amazonaws.com:8000/Item/items/');
            const json = await response.json();
            setItems(json)
            setAllItems(json)
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



    const getRecipe = async () => {
        try {
            const response = await fetch('http://ec2-13-50-248-6.eu-north-1.compute.amazonaws.com:8000/Recipe/all');
            const json = await response.json();
            setRecipes(json)
            setFilterRecipes(json)
            setAllRecipes(json)
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


    updateSearchItem = (text) => {
        setSearchItem(text)

        const updatedData = allItems.filter((item) => {  //const updatedData = allItems.filter((item) => {
            const item_data = `${item.name.toUpperCase()})`;
            const text_data = text.toUpperCase();
            return item_data.indexOf(text_data) > -1;
        });
        setItems(updatedData)
    };

    updateSearchRecipe = (text) => {
        setSearchRecipe(text)

        const updatedData = filterRecipes.filter((item) => {
            const item_data = `${item.name.toUpperCase()})`;
            const text_data = text.toUpperCase();
            return item_data.indexOf(text_data) > -1;
        });
        setRecipes(updatedData)
    };

    const storeImage = (storeTitle) => {
        if (storeTitle == "Ica") {
            return require('../assets/Ica.png')
        }
        else if (storeTitle == "Coop") {
            return require('../assets/Coop.png')
        }
        else {
            return require('../assets/Hemkop.png')
        }
    };

    omButiken = (storeTitle) => {
        if (storeTitle == "Ica") {
            return (
                <View style={{ alignItems: 'center', }}>
                    <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Hitta hit:</Text>
                    <Text>ICA Nära Rosendal</Text>
                    <Text>Torgny Segerstedts allé 25</Text>
                    <Text>75644 Uppsala</Text>
                </View>
            )
        }
        else if (storeTitle == "Coop") {
            return (
                <View style={{ alignItems: 'center', }}>
                    <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Hitta hit:</Text>
                    <Text>Stora Coop Boländerna</Text>
                    <Text>Rapsgatan 1</Text>
                    <Text>75323 Uppsala</Text>
                </View>
            )
        }
        else {
            return (
                <View style={{ alignItems: 'center', }}>
                    <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Hitta hit:</Text>
                    <Text>Hemköp Uppsala Rosendal</Text>
                    <Text>Kansliskrivargatan 1</Text>
                    <Text>752 37 Uppsala</Text>
                </View>
            )
        }
    }

    openHours = (storeTitle) => {
        if (storeTitle == "Ica") {
            return (
                <View>
                    <Text>Måndag-Fredag         8-22</Text>
                    <Text>Lördag                         8-22</Text>
                    <Text>Söndag                        8-22</Text>
                </View>
            )
        }
        else if (storeTitle == "Coop") {
            return (
                <View>
                    <Text>Måndag-Fredag         6-23</Text>
                    <Text>Lördag                         8-22</Text>
                    <Text>Söndag                        8-20</Text>
                </View>
            )
        }
        else {
            return (
                <View>
                    <Text>Måndag-Fredag         8-21</Text>
                    <Text>Lördag                         8-21</Text>
                    <Text>Söndag                        8-21</Text>
                </View>
            )
        }
    }

    storeBuilding = (storeTitle) => {
        if (storeTitle == "Ica") {
            return (
                <View>
                    <Image
                        style={styles.image}
                        source={require('../assets/IcaBuilding.png')}
                    />
                </View>
            )
        }
        else if (storeTitle == "Coop") {
            return (
                <View>
                    <Image
                        style={styles.image}
                        source={require('../assets/CoopBuilding.jpg')}
                    />
                </View>
            )
        }
        else {
            return (
                <View>
                    <Image
                        style={styles.image}
                        source={require('../assets/HemkopBuilding.jpeg')}
                    />
                </View>
            )
        }
    }

    filterFunc = (itemValue) => {
        setSelectedValue(itemValue)
        if (itemValue == 'none') {
            setFilterRecipes(allRecipes)
            setRecipes(allRecipes)
        }
        else {
            const updatedData = allRecipes.filter((item) => {
                console.log(item.category)
                if (item.category == itemValue) {
                    return item;
                }
            });
            setFilterRecipes(updatedData)
            setRecipes(updatedData)
        }
    }

    renderViews = () => {
        ////////////////////////////////-- ABOUT THE STORE SCREEN --////////////////////////////////
        if (page == 0) {
            return (<View style={styles.container}>
                {omButiken(storeTitle)}
                <Text style={{ padding: 5, paddingTop: 30, fontSize: 14, fontWeight: '700' }}>Öppettider</Text>
                {openHours(storeTitle)}
                {storeBuilding(storeTitle)}
            </View>)
        }

        ////////////////////////////////////-- RECIPE SCREEN --////////////////////////////////////
        else if (page == 1) {
            return (
                <View>
                    <SearchBar
                        placeholder="Type Here..."
                        lightTheme
                        round
                        inputContainerStyle={{ backgroundColor: '#ccffcc' }}
                        containerStyle={{ backgroundColor: '#ffffff' }}
                        placeholderTextColor={'#999999'}
                        onChangeText={this.updateSearchRecipe}
                        value={searchRecipe}
                    />

                    <View style={{ justifyContent: 'space-evenly', alignContent: 'center', flexDirection: 'row' }}>
                        <View style={{ marginHorizontal: 40, marginVertical: 15, justifyContent: 'center', height: 40, width: 130, borderRadius: 15, borderWidth: 1, borderColor: '#ffffff', overflow: 'hidden' }}>
                            <Picker
                                mode="dropdown"
                                selectedValue={selectedValue}
                                style={{ flex: 1, backgroundColor: 'silver' }}
                                onValueChange={(itemValue, itemIndex) => filterFunc(itemValue)}
                            >
                                <Picker.Item style={{ fontSize: 14 }} label="Filtrera" value="none" />
                                <Picker.Item style={{ fontSize: 14 }} label="Vegetariskt" value="Vegetarisk" />
                                <Picker.Item style={{ fontSize: 14 }} label="Kött" value="Kött" />
                                <Picker.Item style={{ fontSize: 14 }} label="Fisk" value="Fisk" />
                            </Picker>
                        </View>
                        <View style={{ marginHorizontal: 40, marginVertical: 15, justifyContent: 'center', height: 40, width: 130, borderRadius: 15, borderWidth: 1, borderColor: '#ffffff', overflow: 'hidden' }}>
                            <Picker
                                mode="dropdown"
                                selectedValue={selectedValue}
                                style={{ flex: 1, backgroundColor: 'silver' }}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                            >
                                <Picker.Item style={{ fontSize: 14 }} label="Sortera" value="none" />
                                <Picker.Item style={{ fontSize: 14 }} label="Lägst pris" value="low" />
                                <Picker.Item style={{ fontSize: 14 }} label="Mest rabatt" value="discount" />
                            </Picker>
                        </View>
                    </View>


                    <SafeAreaView style={styles.allProducts}>
                        {isLoading ? (
                            <ActivityIndicator />
                        ) : (
                            <FlatList
                                data={recipes}
                                keyExtractor={({ id }) => id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
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
                </View>)
        }

        ///////////////////////////////////-- PRODUCT SCREEN --///////////////////////////////////
        else {
            return (
                <View>
                    <SearchBar
                        placeholder="Type Here..."
                        lightTheme
                        round
                        inputContainerStyle={{ backgroundColor: '#ccffcc' }}
                        containerStyle={{ backgroundColor: '#ffffff' }}
                        placeholderTextColor={'#999999'}
                        onChangeText={this.updateSearchItem}
                        value={searchItem}
                    />


                    <View style={{ justifyContent: 'space-evenly', alignContent: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.filter}>
                            <Text style={{ fontSize: 18 }}>Filter</Text>
                            <Image
                                source={require('../assets/downward_arrow_green.png')}
                                style={{ resizeMode: 'contain', width: 20, height: 20, }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filter}>
                            <Text style={{ fontSize: 18 }}>Sortera</Text>
                            <Image
                                source={require('../assets/downward_arrow_green.png')}
                                style={{ resizeMode: 'contain', width: 20, height: 20, }} />
                        </TouchableOpacity>
                    </View>


                    <SafeAreaView style={styles.allProducts}>
                        {isLoading ? (
                            <ActivityIndicator />
                        ) : (
                            <FlatList
                                data={items}
                                keyExtractor={({ id }) => id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.products}
                                        onPress={() => {
                                            // toggle the `showDropdown` property of the current item
                                            const newData = [...items];
                                            const index = newData.indexOf(item);
                                            newData[index].showDropdown = !newData[index].showDropdown;
                                            setItems(newData);
                                        }}>
                                        <Image
                                            source={{ uri: item.image }}    //TODO: THIS IS A PLACEHOLDER
                                            style={styles.logo} />

                                        <Text style={styles.txtStyle}>
                                            {item.name}
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.addButton}
                                            onPress={() => {
                                                store.dispatch({ type: 'SET_PRODUCT', payload: item, amount:1});  //KANSKE SKA SKICKA MED item.name?
                                            }}>
                                            <Text style={{ color: defaultColor, fontWeight: 'condensed' }}>
                                                {'\n Lägg till i'}
                                                {'\nvarukorgen'}
                                            </Text>
                                        </TouchableOpacity>
                                        {item.showDropdown && (
                                            <View style={[styles.dropdown, styles.shadow]}>
                                                <View style={styles.section}>
                                                    <Text style={{ fontSize: 15, fontWeight: 'bold', }}>
                                                        {item.name + ", " + item.brand} </Text>
                                                    <Text style={styles.dropdownText}>
                                                        {" Vikt: " + item.weight}</Text>
                                                    <Text style={styles.dropdownText}>
                                                        {" Utgångsdatum: " + item.expiry_date}</Text>
                                                    <Text style={styles.dropdownText}>
                                                        {" Normalpris: " + item.price}</Text>
                                                    <Text style={{ fontWeight: 800, color: 'green' }}>
                                                        {"Rabatterat pris: " + item.discounted_price}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                    </SafeAreaView>
                </View>)
        }
    }

    return (


        <SafeAreaView style={styles.container}>
            <Image
                source={storeImage(storeTitle)}
                style={{ marginTop: 10, resizeMode: 'contain', width: 200, height: 80 }} />
            <View style={styles.container2}>
                <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => setShow(0)}
                >
                    <Text style={styles.buttontexts} >Om butiken</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => setShow(1)}
                >
                    <Text style={styles.buttontexts} >Recept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => setShow(2)}
                >
                    <Text style={styles.buttontexts} >Varor</Text>
                </TouchableOpacity>
            </View>

            {renderViews()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        marginBottom: 40,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    container2: {
        width: Dimensions.get('window').width,
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    containerOuter: {
        flex: 1,
        padding: 30,
        paddingTop: 40,
        justifyContent: 'flex-start',
        backgroundColor: '#ffffff',
    },
    containerInner: {
        marginTop: 5,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    containerLogo: {
        marginTop: 20,
        marginBottom: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    navigationContainer: {
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        alignItems: 'center',
        width: Dimensions.get('window').width,
    },
    allProducts: {
        flex: 1,
        marginBottom: 142,
        marginTop: -40,
    },
    txtStyle: {
        fontWeight: 'bold',
        padding: 10,
        marginBottom: 20,
        marginLeft: 70,
    },
    txtStyleRecipe: {
        fontWeight: 'bold',
        padding: 10,
        marginBottom: 20,
        marginLeft: 110,
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
        borderWidth: 2,
        borderColor: 'white'
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
    dropdownRecipes: {
        backgroundColor: 'white',
        marginBottom: 10,
        marginTop: -10,
        marginLeft: 17,
        paddingTop: 10,
        width: '90%',
        height: 400,
        borderTopRightRadius: borderRadius,
        borderTopLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,
    },
    dropdownText: {
        paddingLeft: 5,
        paddingRight: 5,
    },
    buttontexts: {
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    buttons: {
        padding: 3,
        alignItems: 'center',
    },
    addButton: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: -75,
        marginBottom: 25,
        marginRight: 10,
        marginLeft: 220,
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
    filter: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: 'silver',
        borderTopRightRadius: borderRadius,
        borderTopLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 5,
        marginHorizontal: 40,
    },
    itemContainer: {
        width: '45%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginHorizontal: 5,
    },
    itemImage: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: -20,
    },
    starIcon: {
        marginLeft: 240,
        //marginRight: 40,
        alignItems: 'center',
        flexDirection: 'row',
        tintColor: 'darkgrey',
        width: 30,
        height: 30,
    },
    image: {
        marginTop: 20,
        width: Dimensions.get('window').width - 30,
        height: 350,
        borderTopRightRadius: borderRadius,
        borderTopLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,
    }
})

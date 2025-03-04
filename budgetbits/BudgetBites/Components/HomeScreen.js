import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text, FlatList, Image, Dimensions } from "react-native";
import { SearchBar } from 'react-native-elements';

{ var defaultColor = '#01be12'; }
{ var lightGrey = '#EEEEEE'; }

export default function HomeScreen({ navigation }) {
    // Change to data fetch from db
    const allStores = [{
        id: "1",
        title: "Ica",
    },
    {
        id: "2",
        title: "Hemkop",
    },
    {
        id: "3",
        title: "Coop",
    },];

    const [showFavorit, setShow] = useState(true);
    const [search, setSearch] = useState("")
    const [stores, setStores] = useState([])

    const [selectedIndices, setSelectedIndices] = useState(["3"]);

    const updateFavStores = (result) => {
        return allStores.filter(item => {
            if (result.includes(item.id)) {
                return item.id
            }
        })
    }
    const [favStores, setFavStores] = useState(updateFavStores(selectedIndices))

    const Item = ({ title, item }) => {
        return (
            // onpress - send info about which store was pressed
            <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('Store', { storeTitle: title })}>
                <Text style={{ fontSize: 16, fontWeight: '600', width: 190 }}>{title}</Text>
                {/* LIKE A STORE */}
                <TouchableOpacity
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
                        setFavStores(updateFavStores(result))
                    }}>
                    <Image
                        source={require('../assets/favorite.png')}
                        style={[styles.starIcon, selectedIndices.includes(item.id) && { tintColor: defaultColor }]} />
                </TouchableOpacity>
            </TouchableOpacity >
        );
    };

    const renderItem = ({ item }) => <Item title={item.title} item={item} />;

    updateSearch = (text) => {
        setSearch(text)

        if (text != "") {
            const updatedData = allStores.filter((item) => {
                const item_data = `${item.title.toUpperCase()})`;
                const text_data = text.toUpperCase();
                return item_data.indexOf(text_data) > -1;
            });
            setStores(updatedData)
        }
        else {
            setStores([])
        }
    };

    renderViews = () => {
        if (showFavorit) {
            return (<View style={styles.containerInner}>
                <View>
                    <FlatList
                        data={favStores}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                    />
                </View>
            </View>)
        }
        else {
            return (<View style={styles.containerInner}>
                <Image
                    source={require('../assets/Map.png')}
                    style={{ resizeMode: 'contain', width: Dimensions.get('window').width - 50, height: Dimensions.get('window').height - 250 }} />
            </View>)
        }
    }

    return (
        <View style={styles.containerOuter} >

            <SearchBar
                placeholder="Type Here..."
                lightTheme
                round
                inputContainerStyle={{ backgroundColor: '#ccffcc' }}
                containerStyle={{ backgroundColor: '#ffffff' }}
                placeholderTextColor={'#999999'}
                onChangeText={this.updateSearch}
                value={search}
            />
            <View>
                <FlatList
                    data={stores}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <View style={styles.container2}>
                <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => setShow(true)}
                >
                    <Text style={styles.buttontexts} >Favoritbutiker</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => setShow(false)}
                >
                    <Text style={styles.buttontexts} >Hitta på karta</Text>
                </TouchableOpacity>
            </View>
            {renderViews()}
        </View >
    );
}

const styles = StyleSheet.create({
    containerOuter: {
        flex: 1,
        padding: 30,
        paddingTop: 60,
        justifyContent: 'flex-start',
        backgroundColor: '#ffffff',
    },
    container2: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    containerInner: {
        marginTop: 30,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    containerWeekly: {
        marginTop: 20,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttons: {
        padding: 3,
        alignItems: 'center',
    },
    buttontexts: {
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
    item: {
        padding: 20,
        marginVertical: 5,
        marginHorizontal: 20,
        borderRadius: 20,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 4, //IOS
        elevation: 8, // Android
        borderWidth: 1,
        borderColor: defaultColor,
        backgroundColor: lightGrey,
        flexDirection: 'row',
    },
    starIcon: {
        marginLeft: 10,
        tintColor: 'darkgrey',
        width: 30,
        height: 30,
    },
})
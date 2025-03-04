import React, {Component} from 'react';
import {StyleSheet ,ActivityIndicator, FlatList, Text, View,Button , TextInput} from 'react-native';
export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: true,
    };
  }

  async getItems() {
    try {
      const response = await fetch('http://10.0.2.2:8000/vara/varor');
      const json = await response.json();

      this.setState({data: json});
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({isLoading: false});
    }
  }

  componentDidMount() {
    this.getItems();
  }

  render() {
    const {data, isLoading} = this.state;
    return (
      <View style={{flex: 1, padding: 24}}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={data}
            keyExtractor={({id}) => id}
            renderItem={({item}) => (
              <Text style={styles.txtStyle}>
                {"ID: " + item.id}. {"Name: " +item.name}
                ,{"Price: " + item.price}, {"Expires: " + item.date}
              </Text>
            )}
          />
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    padding:1,
    marginTop:10,
    paddingTop:100,
  },
  txtStyle: {
    fontWeight: 'bold',
    padding:10,
    borderWidth:3,
    borderColor:'red',
    marginBottom:20,
  },
  container: {
    flex: 1,
    backgroundColor: '#aaff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  });

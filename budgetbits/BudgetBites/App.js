import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./navigation/tabs";
import store from "./Components/store";
import { Provider } from 'react-redux';

const Stack = createNativeStackNavigator();

console.disableYellowBox = true;

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tabs />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
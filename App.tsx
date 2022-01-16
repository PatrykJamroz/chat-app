import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { client } from "./components/ApolloSetup";
import { ApolloProvider } from "@apollo/client";
import HomeScreen from "./components/HomeScreen";
import RoomScreen from "./components/RoomScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home Screen / Room list" component={HomeScreen} />
          <Stack.Screen
            name="Room"
            component={RoomScreen}
            options={({ route }) => ({ title: route.params?.roomName })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}

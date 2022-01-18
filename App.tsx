import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { client } from "./Apollo/ApolloSetup";
import { ApolloProvider } from "@apollo/client";
import HomeScreen from "./screens/HomeScreen/HomeScreen";
import RoomScreen from "./screens/RoomScreen/RoomScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={"Home"}>
          <Stack.Screen name="Home" component={HomeScreen} />
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

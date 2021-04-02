import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ScrollView,
} from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { client } from "./components/ApolloSetup";
import {
  GET_ROOMS,
  GET_MESSAGES,
  POST_MESSAGE,
  MESSAGE_SUBSCRIPTION,
} from "./components/Querries";
import {
  ApolloProvider,
  useQuery,
  useMutation,
  useSubscription,
} from "@apollo/client";
import { TextInput } from "react-native-gesture-handler";
import Constants from "expo-constants";
import { login } from "./misc/crede";
import HomeScreen from "./components/HomeScreen";
import RoomScreen from "./components/RoomScreen";

interface Room {
  id: string;
  name: string;
  roomPic: string;
}

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
            // options={{ title: "nazwa pokoju" }}
            options={({ route }) => ({ title: route.params.roomName })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Constants.statusBarHeight,
  },
  roomPic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  roomPicMy: {
    display: "none",
  },
  roomPicThem: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 5,
  },
  input: {},
  myBubble: {
    backgroundColor: "gray",
    padding: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  themBubble: {
    backgroundColor: "lightgray",

    padding: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  themMessage: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 5,
    marginLeft: 10,
  },
  myMessage: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 5,
    marginRight: 10,
  },
  roomListItem: {
    marginTop: 10,
    padding: 5,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "lightgray",
    justifyContent: "center",
  },
  scrollView: {
    marginHorizontal: 20,
  },
});

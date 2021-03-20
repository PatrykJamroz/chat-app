import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Chat from "./components/Chat";
import { ApolloProvider, useQuery, gql } from "@apollo/client";
import { useState } from "react";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Room list:</Text>
      <Chat />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  roomPic: {
    width: 50,
    height: 50,
  },
});

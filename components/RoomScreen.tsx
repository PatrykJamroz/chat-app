import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ScrollView,
} from "react-native";
import "react-native-gesture-handler";
import { GET_MESSAGES, MESSAGE_SUBSCRIPTION } from "./Querries";
import { useQuery } from "@apollo/client";
import { TextInput } from "react-native-gesture-handler";
import Constants from "expo-constants";
import { login } from "../misc/crede";
import PostMessage from "./PostMessage";

export default function RoomScreen(props) {
  const roomID = props.route.params.roomID;
  const { data, loading, error, subscribeToMore } = useQuery(GET_MESSAGES, {
    variables: { roomID: roomID },
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :(</Text>;

  subscribeToMore({
    document: MESSAGE_SUBSCRIPTION,
    variables: { roomID: roomID },
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const newFeedItem = subscriptionData.data.messageAdded;
      return Object.assign({}, prev, {
        room: {
          messages: [newFeedItem, ...prev.room.messages],
        },
      });
    },
  });

  return (
    <ScrollView style={styles.scrollView}>
      {data.room.messages.map((message) => (
        <View key={message.id}>
          <View
            style={
              message.user.firstName === "Penny"
                ? styles.myMessage
                : styles.themMessage
            }
          >
            <Image
              style={
                message.user.firstName === "Penny"
                  ? styles.roomPicMy
                  : styles.roomPicThem
              }
              source={{
                uri:
                  message.user.profilePic !== ""
                    ? message.user.profilePic
                    : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png",
              }}
            />
            <Text
              style={
                message.user.firstName === "Penny"
                  ? styles.myBubble
                  : styles.themBubble
              }
            >
              {message.body}
            </Text>
          </View>
        </View>
      ))}
      <PostMessage roomID={roomID} />
    </ScrollView>
  );
}

//
///
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

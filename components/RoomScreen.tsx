import React, { useState } from "react";
import { Text, View, Image, ScrollView } from "react-native";
import "react-native-gesture-handler";
import { GET_MESSAGES, MESSAGE_SUBSCRIPTION, POST_MESSAGE } from "./Querries";
import { useQuery, useMutation } from "@apollo/client";
// import PostMessage from "./PostMessage";
import { GiftedChat } from "react-native-gifted-chat";
import { styles } from "./styles";
import { login } from "../misc/crede";

export default function RoomScreen(props) {
  const roomID = props.route.params.roomID;
  const [postMessage] = useMutation(POST_MESSAGE);
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
          messages: [...prev.room.messages, newFeedItem],
        },
      });
    },
  });

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={data.room.messages.map((msg) => ({
          _id: msg.id,
          text: msg.body,
          user: {
            _id: msg.user.email,
          },
        }))}
        onSend={(e) => {
          postMessage({
            variables: {
              messageBody: e[0].text,
              roomID: roomID,
              email: login.email,
              password: login.password,
            },
          });
        }}
        user={{ _id: login.email }}
        inverted={false}
      />
    </View>
  );
}

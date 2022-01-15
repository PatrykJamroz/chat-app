import React, { useEffect } from "react";
import { Text, View } from "react-native";
import "react-native-gesture-handler";
import { GET_MESSAGES, MESSAGE_SUBSCRIPTION, POST_MESSAGE } from "./Querries";
import { useQuery, useMutation } from "@apollo/client";
import { GiftedChat } from "react-native-gifted-chat";
import { styles } from "./styles";

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
      // console.log("newfeeditem", newFeedItem);
      // console.log("data", data);
      // console.log("prev", prev);
      return Object.assign({}, prev, {
        messages: [...prev.messages, newFeedItem],
      });
    },
  });

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={data.messages.map((msg) => ({
          _id: new Date() + Math.random().toString(),
          text: msg.body,
          user: {
            _id: msg.user.name,
            name: msg.user.name,
            avatar: msg.user.profilePic,
          },
        }))}
        onSend={(e) => {
          console.log("message send", e[0].text);
          postMessage({
            variables: {
              body: e[0].text,
              roomID: roomID,
              user: "User",
            },
          });
        }}
        user={{ _id: "User" }}
        inverted={false}
        showUserAvatar={false}
        renderUsernameOnMessage={true}
      />
    </View>
  );
}

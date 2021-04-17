import React from "react";
import { Text, View } from "react-native";
import "react-native-gesture-handler";
import {
  /*GET_MESSAGES,*/ MESSAGE_SUBSCRIPTION,
  POST_MESSAGE,
  GET_ROOMS,
} from "./Querries";
import { useQuery, useMutation } from "@apollo/client";
// import PostMessage from "./PostMessage";
import { GiftedChat } from "react-native-gifted-chat";
import { styles } from "./styles";
import { login } from "../misc/crede";

export default function RoomScreen(props) {
  const roomID = props.route.params.roomID;
  const [postMessage] = useMutation(POST_MESSAGE);
  const { data, loading, error, subscribeToMore } = useQuery(GET_ROOMS);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :(</Text>;

  subscribeToMore({
    document: MESSAGE_SUBSCRIPTION,
    // variables: { roomID: roomID },
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const newFeedItem = subscriptionData.data.rooms;
      return Object.assign({}, prev, {
        rooms: {
          // messages: [...prev.room.messages, newFeedItem],
          newFeedItem,
        },
      });
    },
  });

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={data.rooms[roomID].messages.map((msg) => ({
          // _id: msg.id,
          text: msg.body,
          user: {
            _id: msg.user.name,
            name: msg.user.name,
            avatar: msg.user.profilePic,
          },
        }))}
        onSend={(e) => {
          postMessage({
            variables: {
              body: e[0].text,
              roomID: roomID,
              user: "User",
              // password: login.password,
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

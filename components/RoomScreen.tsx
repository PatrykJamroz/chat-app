import React from "react";
import { Text, View, Image, ScrollView } from "react-native";
import "react-native-gesture-handler";
import { GET_MESSAGES, MESSAGE_SUBSCRIPTION } from "./Querries";
import { useQuery } from "@apollo/client";
import PostMessage from "./PostMessage";
import { styles } from "./styles";

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

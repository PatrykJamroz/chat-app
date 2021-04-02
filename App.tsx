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

interface Room {
  id: string;
  name: string;
  roomPic: string;
}

function HomeScreen({ navigation }) {
  const { data, loading, error } = useQuery(GET_ROOMS);
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :(</Text>;

  return data.usersRooms.rooms.map((room: Room) => (
    <View
      style={{ width: 500, marginLeft: "auto", marginRight: "auto" }}
      key={room.id}
    >
      <View style={styles.roomListItem}>
        <Image
          style={styles.roomPic}
          source={{
            uri:
              room.roomPic !== ""
                ? room.roomPic
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png",
          }}
        />
        <View>
          <Text>{room.name}</Text>
          <Button
            title="Go to room"
            onPress={() => {
              navigation.navigate("Room", {
                roomID: room.id,
                roomName: room.name,
              });
              console.log("clicked room id: " + room.id);
            }}
          />
        </View>
      </View>
    </View>
  ));
}

function RoomScreen(props) {
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

function PostMessage(props) {
  const [postMessage, { data }] = useMutation(POST_MESSAGE, {
    variables: { email: login.email, password: login.password },
  });
  const [messageText, setMessageText] = useState("");

  const textInput = useRef(null);

  const roomID = props.roomID;

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <TextInput
        onChangeText={(value) => setMessageText(value)}
        style={{
          backgroundColor: "white",
          height: 34,
          width: 500,
        }}
        placeholder="Aa"
        autoFocus
        ref={textInput}
      />
      <Button
        title="Send"
        onPress={() => {
          postMessage({
            variables: {
              messageBody: messageText,
              roomID: roomID,
            },
          });
          textInput.current.clear();
          console.log(messageText);
          console.log(roomID);
        }}
      />
    </View>
  );
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

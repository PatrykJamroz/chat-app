import React, { useEffect, useRef, useState } from "react";
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
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  gql,
  useQuery,
  useMutation,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import * as AbsintheSocket from "@absinthe/socket";
import { createAbsintheSocketLink } from "@absinthe/socket-apollo-link";
import { Socket as PhoenixSocket } from "phoenix";
import { hasSubscription } from "@jumpn/utils-graphql";
import { split } from "apollo-link";
import { TextInput } from "react-native-gesture-handler";
import Constants from "expo-constants";

const token =
  "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjaGF0bHkiLCJleHAiOjE2MTc2NDEyNTYsImlhdCI6MTYxNTIyMjA1NiwiaXNzIjoiY2hhdGx5IiwianRpIjoiZjBhOTM4MTEtZGJmYy00MWQ4LTg5NmUtOGJhYjFhMjliNThkIiwibmJmIjoxNjE1MjIyMDU1LCJzdWIiOiJiYTdiMTJiMy05Y2IxLTQ0ZDUtODk5MS03Zjc2MjBjODNjMzMiLCJ0eXAiOiJhY2Nlc3MifQ.j81t3nMBrrt3bpVghED4gPTZoiQun2j5xEhSswnZGz8-Rbunttkmw5aIuFPHzfbp552HcPEnQfzsLlcsSpOmNQ";

const httpLink = createHttpLink({
  uri: "https://chat.thewidlarzgroup.com/api/graphiql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const authedHttpLink = authLink.concat(httpLink);

const phoenixSocket = new PhoenixSocket(
  "wss://chat.thewidlarzgroup.com/socket",
  {
    params: () => {
      return {
        token:
          "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjaGF0bHkiLCJleHAiOjE2MTc2NDEyNTYsImlhdCI6MTYxNTIyMjA1NiwiaXNzIjoiY2hhdGx5IiwianRpIjoiZjBhOTM4MTEtZGJmYy00MWQ4LTg5NmUtOGJhYjFhMjliNThkIiwibmJmIjoxNjE1MjIyMDU1LCJzdWIiOiJiYTdiMTJiMy05Y2IxLTQ0ZDUtODk5MS03Zjc2MjBjODNjMzMiLCJ0eXAiOiJhY2Nlc3MifQ.j81t3nMBrrt3bpVghED4gPTZoiQun2j5xEhSswnZGz8-Rbunttkmw5aIuFPHzfbp552HcPEnQfzsLlcsSpOmNQ",
      };
    },
  }
);

const absintheSocket = AbsintheSocket.create(phoenixSocket);

const websocketLink = createAbsintheSocketLink(absintheSocket);

const link = split(
  (operation) => hasSubscription(operation.query),
  websocketLink,
  authedHttpLink
);

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache,
});

interface Room {
  id: string;
  name: string;
  roomPic: string;
}

const GET_ROOMS = gql`
  {
    usersRooms {
      rooms {
        id
        name
        roomPic
      }
      user {
        email
        firstName
        id
        lastName
        profilePic
        role
      }
    }
  }
`;

const GET_MESSAGES = gql`
  query GetMessages($roomID: String!) {
    room(id: $roomID) {
      id
      messages {
        body
        id
        insertedAt
        user {
          email
          firstName
          id
          lastName
          profilePic
          role
        }
      }
      name
      roomPic
      user {
        email
        firstName
        id
        lastName
        profilePic
        role
      }
    }
  }
`;

const POST_MESSAGE = gql`
  mutation PostMessage($messageBody: String!) {
    loginUser(email: "penny@mail.com", password: "aSGH11ghJKl123!") {
      token
      user {
        email
        firstName
        id
        lastName
        profilePic
        role
      }
    }
    sendMessage(
      body: $messageBody
      roomId: "33290044-5232-46be-9302-210f5291905b"
    ) {
      body
      id
      insertedAt
      user {
        email
        firstName
        id
        lastName
        profilePic
        role
      }
    }
  }
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription {
    messageAdded(roomId: "33290044-5232-46be-9302-210f5291905b") {
      body
      id
      insertedAt
      user {
        email
        firstName
        id
        lastName
        profilePic
        role
      }
    }
  }
`;

function PostMessage() {
  let input;
  const [postMessage, { data }] = useMutation(POST_MESSAGE);
  const [messageText, setMessageText] = useState("");

  const textInput = useRef(null);

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
          postMessage({ variables: { messageBody: messageText } });
          textInput.current.clear();
          console.log(messageText);
        }}
      />
    </View>
  );
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
              navigation.navigate("Room", { roomID: room.id });
              console.log("clicked room id: " + room.id);
            }}
          />
        </View>
      </View>
    </View>
  ));
}

//a407ac84-d7df-4b25-804b-00ff1d10acc2
//10aa0124-d863-413f-9845-dc439d327720
//33290044-5232-46be-9302-210f5291905b

function RoomScreen(route) {
  //const { roomID } = route.params; // Cannot read property 'roomID' of undefined
  const roomID = "33290044-5232-46be-9302-210f5291905b"; //hardcoded value
  const { data, loading, error } = useQuery(GET_MESSAGES, {
    variables: { roomID: roomID },
  });
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :(</Text>;

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
      <PostMessage />
    </ScrollView>
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
            options={{ title: "Room id:" }}
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

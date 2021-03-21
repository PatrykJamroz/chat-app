import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
// import Chat from "./components/Chat";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
///
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
import { Formik } from "formik";

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

// room(id: "33290044-5232-46be-9302-210f5291905b")

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

///
let roomIDS = [];

function PostMessage() {
  let input;
  const [postMessage, { data }] = useMutation(POST_MESSAGE);

  //   <Formik
  //   initialValues={{ message: "" }}
  //   onSubmit={(values) => {
  //     postMessage({ variables: { messageBody: values } })
  //   }
  //   }
  // >
  //   {({ handleChange, handleBlur, handleSubmit, values }) => (
  //     <View>
  //       <TextInput
  //         onChangeText={handleChange("message")}
  //         onBlur={handleBlur("message")}
  //         value={values.message}
  //       />
  //       <Button onPress={handleSubmit} title="Submit" />
  //     </View>
  //   )}
  // </Formik>

  return (
    <View>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          postMessage({ variables: { messageBody: input.value } });
          input.value = "";
        }}
      >
        <input
          ref={(node) => {
            input = node;
          }}
        />
        <button type="submit">
          <Text>Send</Text>
        </button>
      </form>
    </View>
  );
}

function HomeScreen({ navigation }) {
  const { data, loading, error } = useQuery(GET_ROOMS);
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :(</Text>;
  roomIDS = data.usersRooms.rooms.map((room: Room) => {
    return room.id;
  });

  return data.usersRooms.rooms.map((room: Room, index) => (
    <View key={room.id}>
      <Image
        style={styles.roomPic}
        source={{
          uri:
            room.roomPic !== ""
              ? room.roomPic
              : "https://lh3.googleusercontent.com/proxy/eLBl-oqqyz7uPHWUOGLBY_ZxXCcOjru-ggO5QfNq3DZeIOUXYYwuj0YZoMhStr-gft55iMF6kfDmfG6l7fXzyxdBl6QzFoN5Wgd0RdU",
        }}
      />
      <Text>{room.name}</Text>
      <Button
        title="Go to room"
        onPress={() => {
          navigation.navigate("Room", { roomID: room.id });
        }}
      />
    </View>
  ));
}

function RoomScreen(route) {
  // const { roomID } = route.params;
  const roomID = "33290044-5232-46be-9302-210f5291905b";
  const { data, loading, error } = useQuery(GET_MESSAGES, {
    variables: { roomID: roomID },
  });
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :(</Text>;

  return (
    <View>
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
                    : "https://www.uclg-planning.org/sites/default/files/styles/featured_home_left/public/no-user-image-square.jpg?itok=PANMBJF-",
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
  },
  roomPic: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    padding: "0.5em",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  themBubble: {
    backgroundColor: "lightgray",

    padding: "0.5em",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  themMessage: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: "5px",
    marginLeft: "1em",
  },
  myMessage: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: "5px",
    marginRight: "1em",
  },
});

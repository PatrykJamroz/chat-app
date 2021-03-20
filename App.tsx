import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image, Button, TextInput } from "react-native";
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
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import * as AbsintheSocket from "@absinthe/socket";
import { createAbsintheSocketLink } from "@absinthe/socket-apollo-link";
import { Socket as PhoenixSocket } from "phoenix";
import { hasSubscription } from "@jumpn/utils-graphql";
import { split } from "apollo-link";

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

///
let roomIDS = [];

function HomeScreen({ navigation }) {
  const { data, loading, error } = useQuery(GET_ROOMS);
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :(</Text>;
  roomIDS = data.usersRooms.rooms.map((room: Room) => {
    return room.id;
  });
  console.log(roomIDS);
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
          <Image
            style={styles.roomPic}
            source={{
              uri:
                message.user.profilePic !== ""
                  ? message.user.profilePic
                  : "https://www.uclg-planning.org/sites/default/files/styles/featured_home_left/public/no-user-image-square.jpg?itok=PANMBJF-",
            }}
          />
          <Text>
            {message.user.firstName}: {message.body}
          </Text>
        </View>
      ))}
      <TextInput style={styles.input} />
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  // let roomIDs = [];

  // function getRoomsID() {
  //   const data = client.readFragment({
  //     rooms
  //     fragment: gql`
  //       {
  //         usersRooms {
  //           rooms {
  //             id
  //             name
  //             roomPic
  //           }
  //         }
  //       }
  //     `,
  //   });
  //   roomIDs = data.usersRooms.rooms.map((room: Room) => {
  //     return room.id;
  //   });
  // }

  // useEffect(() => {
  //   getRoomsID();
  //   console.log(roomIDs);
  // }, []);

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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
});

import { StatusBar } from "expo-status-bar";
import React from "react";
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
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

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

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
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
  query Room($roomID: String!) {
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

function HomeScreen({ navigation }) {
  const { data, loading, error } = useQuery(GET_ROOMS);
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :(</Text>;
  return data.usersRooms.rooms.map((room: Room) => (
    <View key={room.id}>
      <Image style={styles.roomPic} source={{ uri: room.roomPic }} />
      <Text>{room.name}</Text>
      <Button
        title="Go to room"
        onPress={() =>
          navigation.navigate("Room", {
            roomID: "33290044-5232-46be-9302-210f5291905b",
          })
        }
      />
    </View>
  ));
}

function RoomScreen(route) {
  const roomID = route.params;
  const { data, loading, error } = useQuery(GET_MESSAGES, {
    variables: roomID,
  });
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :(</Text>;

  return data.room.messages.map((message) => (
    <View key={message.id}>
      <Image style={styles.roomPic} source={{ uri: message.user.profilePic }} />
      <Text>
        {message.user.firstName}: {message.body}
      </Text>
    </View>
  ));
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
  },
});

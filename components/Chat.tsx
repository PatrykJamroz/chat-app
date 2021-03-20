import React from "react";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  gql,
  useQuery,
} from "@apollo/client";
import { StyleSheet, Text, View, Image } from "react-native";
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

const Room = ({}) => {
  const { data, loading, error } = useQuery(GET_ROOMS);
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :(</Text>;

  return data.usersRooms.rooms.map((room: Room) => (
    <View key={room.id}>
      <Image style={styles.roomPic} source={{ uri: room.roomPic }} />
      <Text>
        {room.id}: {room.name}
      </Text>
    </View>
  ));
};

const Chat = () => {
  return <Room />;
};

export default () => (
  <ApolloProvider client={client}>
    <Chat />
  </ApolloProvider>
);

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

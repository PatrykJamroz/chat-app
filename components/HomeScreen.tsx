import React from "react";
import { Text, View, Image, Button } from "react-native";
import "react-native-gesture-handler";
import { GET_ROOMS } from "./Querries";
import { useQuery } from "@apollo/client";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

interface Room {
  id: string;
  name: string;
}

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

export default function HomeScreen({ navigation }: Props) {
  const { data, loading, error } = useQuery(GET_ROOMS);
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :(</Text>;

  console.log(navigation);

  return data.rooms.map((room: Room) => (
    <View key={room.id}>
      <View>
        <Text>
          {room.id} {room.name}
        </Text>
        <Button
          title="Go to room"
          onPress={() => {
            navigation.navigate("Room", {
              roomID: room.id,
              roomName: room.name,
            });
            console.log("clicked room id: " + room.id + " " + room.name);
          }}
        />
      </View>
    </View>
  ));
}

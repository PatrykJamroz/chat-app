import React from "react";
import { Text, View, Image, Button } from "react-native";
import "react-native-gesture-handler";
import { GET_ROOMS } from "./Querries";
import { useQuery } from "@apollo/client";

interface Room {
  id: string;
  name: string;
  roomPic: string;
}

export default function HomeScreen({ navigation }) {
  const { data, loading, error } = useQuery(GET_ROOMS);
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :(</Text>;

  return data.usersRooms.rooms.map((room: Room) => (
    <View key={room.id}>
      <View>
        <Image
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

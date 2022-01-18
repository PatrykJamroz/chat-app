import { Text, TouchableOpacity, View } from "react-native";
import React from "react";

export function RoomListItem(props) {
  const room = props.item;
  return (
    <TouchableOpacity
      onPress={() => {
        props.navigation.navigate("Room", {
          roomID: room.id,
          roomName: room.name,
        });
      }}
    >
      <Text>
        {room.name} [id: {room.id}]
      </Text>
    </TouchableOpacity>
  );
}

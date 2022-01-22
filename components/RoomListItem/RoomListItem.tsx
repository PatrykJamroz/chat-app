import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { styles } from "./RoomListItem.styles";

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
      style={styles.wrapper}
    >
      <Text style={styles.text}>
        {room.name} [id: {room.id}]
      </Text>
    </TouchableOpacity>
  );
}

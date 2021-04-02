import React from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import "react-native-gesture-handler";
import { GET_ROOMS } from "./Querries";
import { useQuery } from "@apollo/client";
import Constants from "expo-constants";

export default function HomeScreen({ navigation }) {
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

///
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

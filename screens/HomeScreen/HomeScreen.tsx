import React from "react";
import { Text, FlatList, SafeAreaView } from "react-native";
import "react-native-gesture-handler";
import { GET_ROOMS } from "../../gql/queries";
import { useQuery } from "@apollo/client";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { RoomListItem } from "../../components/RoomListItem/RoomListItem";
import { styles } from "./HomeScreen.styles";

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

export default function HomeScreen({ navigation }: Props) {
  const { data, loading, error } = useQuery(GET_ROOMS);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :(</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        keyExtractor={(item) => item.id}
        data={data.rooms}
        renderItem={({ item }) => (
          <RoomListItem item={item} navigation={navigation} />
        )}
      />
    </SafeAreaView>
  );
}

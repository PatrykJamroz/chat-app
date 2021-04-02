import React, { useRef, useState } from "react";
import { View, Button } from "react-native";
import "react-native-gesture-handler";
import { POST_MESSAGE } from "./Querries";
import { useMutation } from "@apollo/client";
import { TextInput } from "react-native-gesture-handler";
import { login } from "../misc/crede";

export default function PostMessage(props) {
  const [postMessage, { data }] = useMutation(POST_MESSAGE, {
    variables: { email: login.email, password: login.password },
  });
  const [messageText, setMessageText] = useState("");

  const textInput = useRef(null);

  const roomID = props.roomID;

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <TextInput
        onChangeText={(value) => setMessageText(value)}
        style={{
          backgroundColor: "white",
          height: 34,
          width: 500,
        }}
        placeholder="Aa"
        autoFocus
        ref={textInput}
      />
      <Button
        title="Send"
        onPress={() => {
          postMessage({
            variables: {
              messageBody: messageText,
              roomID: roomID,
            },
          });
          textInput.current.clear();
          console.log(messageText);
          console.log(roomID);
        }}
      />
    </View>
  );
}

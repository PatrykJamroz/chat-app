import { gql } from "@apollo/client";

export const MESSAGE_SUBSCRIPTION = gql`
  subscription MessageAdded($roomID: String!) {
    messageAdded(roomID: $roomID) {
      user {
        name
        profilePic
      }
      body
    }
  }
`;

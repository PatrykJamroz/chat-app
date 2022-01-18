import { gql } from "@apollo/client";

export const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      id
      name
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($roomID: String!) {
    messages(roomID: $roomID) {
      user {
        name
        profilePic
      }
      body
    }
  }
`;

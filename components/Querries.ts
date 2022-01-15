import { gql } from "@apollo/client";

const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      id
      name
    }
  }
`;

const GET_MESSAGES = gql`
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

const POST_MESSAGE = gql`
  mutation PostMessage($user: String!, $body: String!, $roomID: String!) {
    postMessage(user: $user, body: $body, roomID: $roomID) {
      user {
        name
        profilePic
      }
      body
    }
  }
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription messageAdded($roomID: String!) {
    messageAdded(roomID: $roomID) {
      user {
        name
        profilePic
      }
      body
    }
  }
`;

export { GET_ROOMS, GET_MESSAGES, POST_MESSAGE, MESSAGE_SUBSCRIPTION };

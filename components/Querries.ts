import { gql } from "@apollo/client";

const GET_ROOMS = gql`
  {
    usersRooms {
      rooms {
        id
        name
        roomPic
      }
      user {
        email
        firstName
        id
        lastName
        profilePic
        role
      }
    }
  }
`;

const GET_MESSAGES = gql`
  query GetMessages($roomID: String!) {
    room(id: $roomID) {
      id
      messages {
        body
        id
        insertedAt
        user {
          email
          firstName
          id
          lastName
          profilePic
          role
        }
      }
      name
      roomPic
      user {
        email
        firstName
        id
        lastName
        profilePic
        role
      }
    }
  }
`;

const POST_MESSAGE = gql`
  mutation PostMessage(
    $messageBody: String!
    $roomID: String!
    $email: String!
    $password: String!
  ) {
    loginUser(email: $email, password: $password) {
      token
      user {
        email
        firstName
        id
        lastName
        profilePic
        role
      }
    }
    sendMessage(body: $messageBody, roomId: $roomID) {
      body
      id
      insertedAt
      user {
        email
        firstName
        id
        lastName
        profilePic
        role
      }
    }
  }
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription messageAdded($roomID: String!) {
    messageAdded(roomId: $roomID) {
      body
      id
      insertedAt
      user {
        email
        firstName
        id
        lastName
        profilePic
        role
      }
    }
  }
`;

export { GET_ROOMS, GET_MESSAGES, POST_MESSAGE, MESSAGE_SUBSCRIPTION };

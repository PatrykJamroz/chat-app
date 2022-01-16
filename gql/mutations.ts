import { gql } from "@apollo/client";

export const POST_MESSAGE = gql`
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

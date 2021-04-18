import { gql } from "@apollo/client";

const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      id
      name
      messages {
        user {
          name
          profilePic
        }
        body
      }
    }
  }
`;

// const GET_MESSAGES = gql`
//   query GetMessages($roomID: String!) {
//     room(id: $roomID) {
//       id
//       messages {
//         body
//         id
//         insertedAt
//         user {
//           email
//           firstName
//           id
//           lastName
//           profilePic
//           role
//         }
//       }
//       name
//       roomPic
//       user {
//         email
//         firstName
//         id
//         lastName
//         profilePic
//         role
//       }
//     }
//   }
// `;

const POST_MESSAGE = gql`
  mutation postMessage($user: String!, $roomID: String!, $body: String!) {
    postMessage(user: $user, roomID: $roomID, body: $body)
  }
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription rooms {
    rooms {
      id
      name
      messages {
        user {
          name
          profilePic
        }
        body
      }
    }
  }
`;

export { GET_ROOMS, /*GET_MESSAGES,*/ POST_MESSAGE, MESSAGE_SUBSCRIPTION };

//import { GraphQLServer } from "graphql-yoga";
const { GraphQLServer } = require("graphql-yoga");

const rooms = [
  {
    id: 0,
    name: "Beer group",
    picture: "picture of beer",
    messages: [
      {
        user: {
          name: "PJ",
          id: 0,
          profilePic: "PJ pic",
        },
        body: "Hey mates! Beer tonight?",
      },
    ],
  },
  {
    id: 1,
    name: "Bikes group",
    picture: "picture of bike",
    messages: [
      {
        user: {
          name: "MJ",
          id: 1,
          profilePic: "MJ pic",
        },
        body: "Ride tomorrow morning?",
      },
    ],
  },
];
const room = {};

const messages = [];

const typeDefs = `

type RoomsType {
  id: ID!
  name: String
  picture: String
  messages: [SingleMessage]
}

type SingleRoomType{
  id: ID!
  name: String
  picture: String

}

type SingleMessage {
  user: SingleUserType
  body: String
}

type SingleUserType {
  name: String
  id: ID
  profilePic: String
}

type Query {
    rooms: [RoomsType]
    room: SingleRoomType
}

type Mutation {
  postMessage(user: String!, body: String!): ID!
  createRoom(name: String!): ID!
}
`;

const resolvers = {
  Query: {
    // messages: () => messages,
    rooms: () => rooms,
    // room: () => rooms,
  },
  Mutation: {
    //   postMessage: (parent, { user, body, roomID }) => {
    //     const id = messages.length;
    //     room[roomID].messages.push({
    //       id,
    //       user,
    //       body,
    //     });
    //     return id;
    //   },
    // },
    createRoom: (parent, { name }) => {
      const id = rooms.length;
      rooms.push({ id, name });
      return id;
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(({ port }) => {
  console.log(`Server on http://localhost:${port}/`);
});

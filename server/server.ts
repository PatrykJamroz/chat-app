//import { GraphQLServer } from "graphql-yoga";
const { GraphQLServer } = require("graphql-yoga");

// interface RoomsType {
//   id: String;
//   name: String;
//   picture: String;
// }

const rooms = [];
const room = {};

// const messages = [];

const typeDefs = `

type RoomsType {
  id: ID!
  name: String
  picture: String
}

type SingleRoomType {
  id: ID!
  name: String
  picture: String

}

type SingleMessage {
  id: ID
  user: SingleUserType
  body: String
  insertedAt: String
}

type SingleUserType {
  name: String
  id: ID
  profilePic: String
}

type Query {
    rooms: [RoomsType]
    room(id: ID!): SingleRoomType
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
    room: () => room,
  },
  Mutation: {
    //   postMessage: (parent, { user, body }) => {
    //     const id = messages.length;
    //     messages.push({
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

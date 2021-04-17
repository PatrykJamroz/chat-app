//import { GraphQLServer } from "graphql-yoga";
const { GraphQLServer, PubSub } = require("graphql-yoga");

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
  postMessage(user: String!, body: String!, roomID: String!): ID!
  createRoom(name: String!): ID!
}

type Subscription {
  rooms: [RoomsType]
}
`;

const subscribers = [];
const onRoomsUpdates = (fn) => subscribers.push(fn);

const resolvers = {
  Query: {
    // messages: () => messages,
    rooms: () => rooms,
    // room: () => rooms,
  },
  Mutation: {
    postMessage: (parent, { user, body, roomID }) => {
      const id = rooms[roomID].messages.length;
      rooms[roomID].messages.push({
        user: {
          name: user,
          id: id,
          profilePic: "USER pic",
        },
        body: body,
      });
      subscribers.forEach((fn) => fn());
      return id;
    },
    createRoom: (parent, { name }) => {
      const id = rooms.length;
      rooms.push({ id, name });
      return id;
    },
  },
  Subscription: {
    rooms: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random().toString(36).slice(2, 15);
        onRoomsUpdates(() => pubsub.publish(channel, { rooms }));
        setTimeout(() => pubsub.publish(channel, { rooms }), 0);
        return pubsub.asyncIterator(channel);
      },
    },
  },
};

const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });
server.start(({ port }) => {
  console.log(`Server on http://localhost:${port}/`);
});

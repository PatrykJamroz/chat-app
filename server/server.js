const { GraphQLServer, PubSub } = require("graphql-yoga");

const chat = [
  {
    id: 0,
    name: "Beer group",
    messages: [
      {
        user: {
          name: "PJ",
          profilePic: "PJ pic",
        },
        body: "Hey mates! Beer tonight?",
      },
    ],
  },
  {
    id: 1,
    name: "Bikes group",
    messages: [
      {
        user: {
          name: "MJ",
          profilePic: "MJ pic",
        },
        body: "Ride tomorrow morning?",
      },
    ],
  },
];

const typeDefs = `
type Query {
  rooms: [RoomsType]
  messages(roomID: String!): [SingleMessageType]
}

type Mutation {
postMessage(user: String!, body: String!, roomID: String!): SingleMessageType
createRoom(name: String!): ID!
}

type Subscription {
  messageAdded(roomID: String!): SingleMessageType
}

type RoomsType {
  id: String
  name: String
}

type SingleMessageType {
  user: SingleUserType
  body: String
}

type SingleUserType {
  name: String
  profilePic: String
}
`;

const resolvers = {
  Query: {
    rooms: () => chat,
    messages: (parent, { roomID }) => chat[roomID].messages,
  },
  Mutation: {
    postMessage: (parent, { user, body, roomID }, { pubsub }) => {
      const newMessage = {
        user: {
          name: user,
          profilePic: "USER pic",
        },
        body: body,
      };
      chat[roomID].messages.push(newMessage);
      pubsub.publish("messageAdded", { messageAdded: newMessage });
      return newMessage;
    },
    createRoom: (parent, { name }) => {
      const id = rooms.length;
      const messages = [];
      chat.push({ id, name, messages });
      return id;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: () => {
        return pubsub.asyncIterator("messageAdded");
      },
    },
  },
};

const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });
server.start(({ port }) => {
  console.log(`Server on http://localhost:${port}/`);
});

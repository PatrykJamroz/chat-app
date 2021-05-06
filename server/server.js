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
postMessage(user: String!, body: String!, roomID: String!): ID!
createRoom(name: String!): ID!
}

type Subscription {
  messageAdded(roomID: String!): [SingleMessageType]
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

const subscribers = [];
const onRoomsUpdates = (fn) => subscribers.push(fn);

const resolvers = {
  Query: {
    rooms: () => chat,
    messages: (parent, { roomID }) => chat[roomID].messages,
  },
  Mutation: {
    postMessage: (parent, { user, body, roomID }) => {
      // const id = rooms[roomID].messages.length;
      chat[roomID].messages.push({
        user: {
          name: user,
          profilePic: "USER pic",
        },
        body: body,
      });
      subscribers.forEach((fn) => fn());
      return roomID;
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
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random().toString(36).slice(2, 15);
        onRoomsUpdates(() =>
          pubsub.publish(channel, {
            messageAdded: [
              { user: { name: "name", profilePic: "" }, body: "body" },
            ],
          })
        );
        setTimeout(
          () =>
            pubsub.publish(channel, {
              messageAdded: [
                { user: { name: "name", profilePic: "" }, body: "body" },
              ],
            }),
          0
        );
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

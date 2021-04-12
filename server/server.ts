//import { GraphQLServer } from "graphql-yoga";
const { GraphQLServer } = require("graphql-yoga");

const messages = [];

const typeDefs = `
type Message {
    id: ID!
    user: String!
    body: String!
}

type Query {
    messages: [Message!]
}

type Mutation {
  postMessage(user: String!, body: String!): ID!
}
`;

const resolvers = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    postMessage: (parent, { user, body }) => {
      const id = messages.length;
      messages.push({
        id,
        user,
        body,
      });
      return id;
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(({ port }) => {
  console.log(`Server on http://localhost:${port}/`);
});

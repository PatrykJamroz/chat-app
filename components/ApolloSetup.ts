import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import * as AbsintheSocket from "@absinthe/socket";
import { createAbsintheSocketLink } from "@absinthe/socket-apollo-link";
import { Socket as PhoenixSocket } from "phoenix";
import { hasSubscription } from "@jumpn/utils-graphql";
import { split } from "apollo-link";
import { WebSocketLink } from "@apollo/client/link/ws";

import { token } from "../misc/crede";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/",
});

// const authLink = setContext((_, { headers }) => {
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : "",
//     },
//   };
// });

// const authedHttpLink = authLink.concat(httpLink);

// const phoenixSocket = new PhoenixSocket("ws://localhost:4000", {
//   params: {} /*() => {
//     return {
//       // token: token,
//     };
//   },*/,
// });

// const absintheSocket = AbsintheSocket.create(phoenixSocket);

// const websocketLink = createAbsintheSocketLink(absintheSocket);

const websocketLink = new WebSocketLink({
  uri: "ws://localhost:4000/",
  options: {
    reconnect: true,
  },
});

// const link = split(
//   (operation) => hasSubscription(operation.query),
//   websocketLink,
//   // authedHttpLink
//   httpLink
// );

const cache = new InMemoryCache();

export const client = new ApolloClient({
  websocketLink,
  uri: "http://localhost:4000/",
  cache,
});

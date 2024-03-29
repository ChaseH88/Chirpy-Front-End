import {
  ApolloProvider as ApolloProviderDep,
  ApolloClient,
  InMemoryCache,
  from,
  ApolloLink,
  split,
} from "@apollo/client";
import { auth } from "./auth";
import { BASE_URL } from "./constants";
import { link as socketLink } from "./SSELink";
import { getMainDefinition } from "@apollo/client/utilities";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const httpLink = createUploadLink({
  uri: `http://${BASE_URL}/graphql`,
  headers: {
    ...auth(),
  },
});
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      ...auth(),
    },
  });
  return forward(operation);
});

const httpLinkWithMiddleware = from([authMiddleware, httpLink]);

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  socketLink,
  httpLinkWithMiddleware
);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const ApolloProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => (
  <ApolloProviderDep client={client}>{children}</ApolloProviderDep>
);

export { ApolloProvider };

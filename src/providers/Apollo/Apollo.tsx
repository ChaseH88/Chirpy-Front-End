import {
  ApolloProvider as ApolloProviderDep,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  ApolloLink,
} from "@apollo/client";
import { auth } from "./auth";
import { BASE_URL } from "./constants";
import { link as socketLink } from "./SSELink";

const httpLink = new HttpLink({ uri: `http://${BASE_URL}/graphql` });
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: auth,
  });
  return forward(operation);
});

const httpLinkWithMiddleware = from([authMiddleware, socketLink, httpLink]);

// Apollo Client setup
export const client = new ApolloClient({
  link: httpLinkWithMiddleware,
  cache: new InMemoryCache(),
});

// ApolloProvider component
const ApolloProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => (
  <ApolloProviderDep client={client}>{children}</ApolloProviderDep>
);

export { ApolloProvider };

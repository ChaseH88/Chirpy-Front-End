import {
  ApolloProvider as ApolloProviderDep,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client";

const BASE_URL = "http://192.168.4.29:4000/graphql";

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: BASE_URL,
  headers: {
    authorization: localStorage.getItem("token") || "",
  },
});

const ApolloProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => (
  <ApolloProviderDep client={client}>{children}</ApolloProviderDep>
);

export { ApolloProvider };

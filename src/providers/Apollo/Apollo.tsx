import {
  ApolloProvider as _ApolloProvider,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'http://localhost:4000/graphql',
});

const ApolloProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => (
  <_ApolloProvider client={client}>{children}</_ApolloProvider>
);

export { ApolloProvider };

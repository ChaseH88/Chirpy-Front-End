import { ApolloError } from "@apollo/client";

export const normalizeGraphQLError = (error: ApolloError): string | null => {
  const err = error.graphQLErrors[0]?.message || null;
  err && console.log("ERROR: ", err);
  return err;
};

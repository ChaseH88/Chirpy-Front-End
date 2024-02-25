import { ApolloError } from "@apollo/client";

export const normalizeGraphQLError = (error: ApolloError): string | null => {
  console.log("error", error);
  return error.graphQLErrors[0]?.message || null;
};

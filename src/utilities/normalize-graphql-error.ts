import { ApolloError } from "@apollo/client";

export const normalizeGraphQLError = (error: ApolloError): string | null =>
  error.graphQLErrors?.length
    ? (error as any).graphQLErrors[0].extensions.originalError?.message ||
      error.graphQLErrors[0].message
    : null;

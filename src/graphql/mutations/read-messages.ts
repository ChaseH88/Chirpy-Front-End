import { gql } from "@apollo/client";

export const READ_MESSAGES_MUTATION = gql`
  mutation ReadMessages($messageIds: [ID!]!) {
    readMessages(messageIds: $messageIds)
  }
`;

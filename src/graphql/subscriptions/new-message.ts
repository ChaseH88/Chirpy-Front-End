import { gql } from "@apollo/client";

export const MESSAGE_SUBSCRIPTION = gql`
  subscription MessageSent {
    messageSent {
      id
      fromId {
        id
        username
      }
      content
      createdAt
    }
  }
`;

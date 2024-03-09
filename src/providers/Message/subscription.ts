import { gql } from "@apollo/client";

export const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($data: SendMessageInput!) {
    sendMessage(data: $data) {
      id
    }
  }
`;

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

import { gql } from "@apollo/client";

export const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($data: SendMessageInput!) {
    sendMessage(data: $data) {
      id
    }
  }
`;

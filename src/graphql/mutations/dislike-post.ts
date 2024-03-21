import { gql } from "@apollo/client";

export const DISLIKE_POST_MUTATION = gql`
  mutation DislikePost($data: DislikePostInput!) {
    dislikePost(data: $data)
  }
`;

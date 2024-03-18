import { gql } from "@apollo/client";

export const LIKE_POST_MUTATION = gql`
  mutation LikePost($data: LikePostInput!) {
    likePost(data: $data)
  }
`;

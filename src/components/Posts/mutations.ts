import { gql } from "@apollo/client";

export const CREATE_POST_COMMENT_MUTATION = gql`
  mutation CreatePostComment($data: CreatePostCommentInput!) {
    createPostComment(data: $data)
  }
`;

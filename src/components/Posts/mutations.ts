import { gql } from "@apollo/client";

export const CREATE_POST_COMMENT_MUTATION = gql`
  mutation CreatePostComment($data: CreatePostCommentInput!) {
    createPostComment(data: $data)
  }
`;

export const LIKE_POST_MUTATION = gql`
  mutation LikePost($data: LikePostInput!) {
    likePost(data: $data)
  }
`;

export const DISLIKE_POST_MUTATION = gql`
  mutation DislikePost($data: DislikePostInput!) {
    dislikePost(data: $data)
  }
`;

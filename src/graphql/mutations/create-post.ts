import { gql } from "@apollo/client";

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($data: CreatePostInput!) {
    createPost(data: $data) {
      id
      content
      postedBy {
        id
        username
      }
    }
  }
`;

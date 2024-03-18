import { gql } from "@apollo/client";

export const FOLLOW_USER = gql`
  mutation FollowUser($userId: ID!) {
    followUser(userId: $userId)
  }
`;

export const EDIT_USER_MUTATION = gql`
  mutation EditUser($id: ID!, $data: EditUserInput!) {
    editUser(id: $id, data: $data) {
      id
      username
      email
      bio
      firstName
      lastName
      photo
      posts {
        id
      }
    }
  }
`;

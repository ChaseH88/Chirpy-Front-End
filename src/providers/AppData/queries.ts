import { gql } from "@apollo/client";

export const CURRENT_USER_QUERY = gql`
  {
    currentUser {
      id
      username
      email
      createdAt
      firstName
      lastName
      bio
      posts {
        id
        content
        likes {
          id
          username
        }
        dislikes {
          id
          username
        }
        comments {
          id
          comment
          user {
            id
            username
          }
        }
      }
    }
  }
`;

import { gql } from "@apollo/client";

export const CURRENT_USER_QUERY = gql`
  {
    currentUser {
      user {
        id
        username
        email
        createdAt
        firstName
        lastName
        bio
        photo
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
      messages {
        id
        content
        fromId {
          id
          username
        }
        toId {
          id
          username
        }
        createdAt
      }
    }
  }
`;

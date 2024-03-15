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
          photo
        }
        toId {
          id
          username
          photo
        }
        createdAt
      }
      posts {
        likes {
          id
          content
          postedBy {
            id
            username
          }
        }
        dislikes {
          id
          content
          postedBy {
            id
            username
          }
        }
        comments {
          id
          content
          postedBy {
            id
            username
          }
        }
      }
    }
  }
`;

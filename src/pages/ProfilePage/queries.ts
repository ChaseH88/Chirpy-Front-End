import { gql } from "@apollo/client";

export const GET_USER_BY_USERNAME_QUERY = gql`
  query GetUserByUsername($username: String!) {
    findUserByUsername(username: $username) {
      id
      username
      firstName
      lastName
      bio
      photo
      followers {
        id
        username
      }
      following {
        id
        username
      }
      blocked {
        id
        username
      }
      posts {
        id
        postedBy {
          id
          username
          photo
        }
        content
        comments {
          id
          comment
          user {
            id
            username
          }
          createdAt
        }
        likes {
          id
          username
        }
        dislikes {
          id
          username
        }
        createdAt
      }
      createdAt
    }
  }
`;

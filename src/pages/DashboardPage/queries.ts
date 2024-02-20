import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  {
    allPosts {
      id
      postedBy {
        id
        username
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
  }
`;

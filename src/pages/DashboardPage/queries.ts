import { gql } from "@apollo/client";

export const GET_DASHBOARD_POSTS = gql`
  {
    trendingPosts {
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

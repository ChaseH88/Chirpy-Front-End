import { gql } from "@apollo/client";

export const GET_DASHBOARD_POSTS = gql`
  query GetDashboardFeed($nextToken: Int, $limit: Int) {
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
    allPosts(nextToken: $nextToken, limit: $limit) {
      nextToken
      totalCount
      posts {
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
  }
`;

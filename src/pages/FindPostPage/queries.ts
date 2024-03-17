import { gql } from "@apollo/client";

export const FIND_POST_QUERY = gql`
  query FindPostQuery($id: ID!) {
    findPost(id: $id) {
      id
      postedBy {
        id
        username
        followers {
          id
          username
        }
        following {
          id
          username
        }
      }
      likes {
        id
        username
      }
      dislikes {
        id
        username
      }
      content
      comments {
        id
        user {
          id
          username
        }
        comment
        createdAt
      }
      createdAt
    }
  }
`;

import { gql } from "@apollo/client";

export const SEARCH_QUERY = gql`
  query Search($search: String!, $type: [SearchType!]!) {
    search(search: $search, type: $type) {
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
      users {
        id
        username
        firstName
        lastName
        email
        bio
      }
      groups {
        id
        name
      }
    }
  }
`;

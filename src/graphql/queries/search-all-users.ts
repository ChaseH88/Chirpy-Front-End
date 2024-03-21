import { gql } from "@apollo/client";

export const SEARCH_QUERY = gql`
  {
    search(search: "*", type: [USER]) {
      users {
        id
        username
      }
    }
  }
`;

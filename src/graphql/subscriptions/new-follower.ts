import { gql } from "@apollo/client";

export const NEW_FOLLOWER_SUBSCRIPTION = gql`
  subscription NewFollower {
    newFollower {
      id
      username
      photo
    }
  }
`;

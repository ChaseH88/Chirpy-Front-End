import { gql } from '@apollo/client';

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!) {
    createUser(
      data: { username: $username, email: $email, password: $password }
    ) {
      id
      username
      email
    }
  }
`;

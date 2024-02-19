import { useQuery, gql } from '@apollo/client';

const GET_POSTS = gql`
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
    }
  }
`;

const DashboardPage = () => {
  const { loading, error, data } = useQuery(GET_POSTS);

  console.log({ loading, error, data });

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard</p>
    </div>
  );
};

export { DashboardPage };

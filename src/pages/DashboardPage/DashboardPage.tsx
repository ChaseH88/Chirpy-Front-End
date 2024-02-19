import { useQuery } from '@apollo/client';
import { GET_POSTS } from './queries';
import { useAppData } from '../../hooks/useAppData';
import { useAuth } from '../../hooks/useAuth';
import { Posts } from '../../components/Posts/Posts';

const DashboardPage = () => {
  const { loading, error, data } = useQuery(GET_POSTS);
  const { currentUser } = useAppData();
  const { logout } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <h3>{`Welcome ${currentUser!.username}`}</h3>
      <p>Welcome to the dashboard</p>
      <button onClick={logout}>Logout</button>
      <Posts posts={data?.posts} headingText="All Posts" />
    </div>
  );
};

export { DashboardPage };

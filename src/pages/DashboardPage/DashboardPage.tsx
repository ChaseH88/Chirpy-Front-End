import { useQuery } from '@apollo/client';
import { GET_POSTS } from './queries';
import { useAppData } from '../../hooks/useAppData';

const DashboardPage = () => {
  const { loading, error, data } = useQuery(GET_POSTS);
  const { currentUser } = useAppData();

  return (
    <div>
      <h1>Dashboard</h1>
      <h3>{`Welcome ${currentUser!.username}`}</h3>
      <p>Welcome to the dashboard</p>
    </div>
  );
};

export { DashboardPage };

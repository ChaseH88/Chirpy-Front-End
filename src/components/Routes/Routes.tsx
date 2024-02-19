import { Route, Routes as RouterRoutes } from 'react-router-dom';
import { CreateUserPage } from '../../pages/CreateUserPage';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

const Routes = (): JSX.Element => (
  <RouterRoutes>
    <Route path="/create-user" element={<CreateUserPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
  </RouterRoutes>
);

export { Routes };

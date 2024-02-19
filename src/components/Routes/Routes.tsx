import { Navigate, Route, Routes as RouterRoutes } from 'react-router-dom';
import { CreateUserPage } from '../../pages/CreateUserPage';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';

const Routes = (): JSX.Element => {
  const { isLoggedIn } = useAuth();

  const handleIsLoggedInRedirect = (component: JSX.Element): JSX.Element =>
    isLoggedIn ? <Navigate to="/dashboard" replace /> : component;

  return (
    <RouterRoutes>
      <Route path="/" element={handleIsLoggedInRedirect(<LoginPage />)} />
      <Route
        path="/create-user"
        element={handleIsLoggedInRedirect(<CreateUserPage />)}
      />
      <Route path="/login" element={handleIsLoggedInRedirect(<LoginPage />)} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={handleIsLoggedInRedirect(<LoginPage />)} />
    </RouterRoutes>
  );
};

export { Routes };

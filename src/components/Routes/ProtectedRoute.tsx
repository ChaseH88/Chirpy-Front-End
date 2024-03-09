import { Navigate } from "react-router-dom";
import { useAppData } from "../../hooks/useAppData";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const { currentUser, loading } = useAppData();
  const { isLoggedIn } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn || !currentUser) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export { ProtectedRoute };

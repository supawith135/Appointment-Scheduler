import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  role: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role }) => {
  const storedRole = localStorage.getItem('role');

  // If no role or roles do not match, navigate to login
  if (!storedRole || storedRole !== role) {
    return <Navigate to="/" />;
  }

  // If roles match, render the children
  return <Outlet />;
};

export default ProtectedRoute;

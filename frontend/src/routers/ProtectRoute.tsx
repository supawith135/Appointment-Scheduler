import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  role: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (user?.role !== role) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;

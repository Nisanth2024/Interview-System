import { Navigate } from 'react-router-dom';
import type { JSX } from 'react/jsx-runtime';

function isAuthenticated() {
  const token = localStorage.getItem('token');
  return !!token;
}

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;

import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

// wraps any route that requires authentication
// while checkAuth is still loading → show nothing (prevents flash)
// if not authenticated => redirect to /login
// if authenticated => render the child route

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

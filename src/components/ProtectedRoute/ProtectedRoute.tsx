import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PageLoader from '../PageLoader/PageLoader';
import { AccessDeniedPage } from '../PageStates/PageStates';
import { useAuth } from '../../context/useAuth';

type ProtectedRouteProps = {
  children: ReactNode;
  managerOnly?: boolean;
};

function ProtectedRoute({
  children,
  managerOnly = false,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, isAuthLoading, profile } = useAuth();

  if (isAuthLoading) {
    return <PageLoader label="Checking your session" />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: `${location.pathname}${location.search}` }}
        replace
      />
    );
  }

  if (managerOnly && !profile?.venueManager) {
    return <AccessDeniedPage />;
  }

  return children;
}

export default ProtectedRoute;

import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getSession, isAdmin } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasAdminRole, setHasAdminRole] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        // First check if user has a valid session
        const session = await getSession();
        const authenticated = session !== null;
        setIsAuthenticated(authenticated);

        // If authenticated, verify they have admin role
        if (authenticated) {
          const adminStatus = await isAdmin();
          setHasAdminRole(adminStatus);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setHasAdminRole(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Laden...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Redirect to home if authenticated but not admin
  if (!hasAdminRole) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          message: 'Sie haben keine Berechtigung, auf den Admin-Bereich zuzugreifen.'
        }}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

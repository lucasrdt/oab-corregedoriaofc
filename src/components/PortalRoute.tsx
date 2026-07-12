import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type Role = 'admin' | 'dev' | 'presidente' | 'user' | null;

const ROLE_DASHBOARDS: Record<string, string> = {
  admin: '/portal/admin',
  dev: '/portal/dev',
  presidente: '/portal/presidente',
  user: '/portal/user',
};

interface PortalRouteProps {
  allowedRoles: Role[];
}

export const PortalRoute: React.FC<PortalRouteProps> = ({ allowedRoles }) => {
  const { session, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/portal" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={ROLE_DASHBOARDS[role ?? ''] ?? '/portal'} replace />;
  }

  return <Outlet />;
};

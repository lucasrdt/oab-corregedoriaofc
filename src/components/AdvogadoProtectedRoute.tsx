import { Navigate, Outlet } from 'react-router-dom';
import { useAdvogadoAuth } from '@/contexts/AdvogadoAuthContext';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

interface AdvogadoProtectedRouteProps {
  children?: ReactNode;
}

const AdvogadoProtectedRoute = ({ children }: AdvogadoProtectedRouteProps) => {
  const { session, advogado, loading } = useAdvogadoAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || !advogado) {
    return <Navigate to="/honorarios/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AdvogadoProtectedRoute;

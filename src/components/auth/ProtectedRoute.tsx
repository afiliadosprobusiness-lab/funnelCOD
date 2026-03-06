import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthUser } from "@/hooks/use-auth";
import { isSuperadmin } from "@/store/auth-store";

interface ProtectedRouteProps {
  children: ReactNode;
  superadminOnly?: boolean;
}

export default function ProtectedRoute({ children, superadminOnly = false }: ProtectedRouteProps) {
  const user = useAuthUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  if (superadminOnly && !isSuperadmin(user)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!superadminOnly && isSuperadmin(user)) {
    return <Navigate to="/superadmin" replace />;
  }

  return <>{children}</>;
}

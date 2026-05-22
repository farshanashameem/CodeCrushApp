import React from "react";
import { Navigate } from "react-router-dom";
import type { UserRole } from "../../Constants/Role";
import { useAuth } from "../../Hooks/useAuth";

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const RoleRoute: React.FC<RoleRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    // If this route is meant for admin
    if (allowedRoles.includes("admin")) {
      return <Navigate to="/admin/login" replace />;
    }

    // Parent route
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role
  if (!user || !allowedRoles.includes(user.role)) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user?.role === "parent") {
      return <Navigate to="/parent/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
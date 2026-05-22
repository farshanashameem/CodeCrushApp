import { Navigate } from "react-router-dom";
import { useAuth } from "../../Hooks/useAuth";

type Props = {
  children: React.ReactNode;
  allowedRole: "admin" | "parent";
};

export default function ProtectedRoute({
  children,
  allowedRole,
}: Props) {

  const {
    user,
     authChecked,
    loading,
    isAuthenticated
  } = useAuth();

  if (!authChecked) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-pink-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // not logged in
  if (!isAuthenticated) {
    return (
      <Navigate
        to={
          allowedRole === "admin"
            ? "/admin/login"
            : "/parent/auth"
        }
        replace
      />
    );
  }

  // user not loaded yet
  if (!user) return null;

  // role mismatch
  if (
    user.role.toLowerCase() !==
    allowedRole
  ) {

    if (
      user.role.toLowerCase() ===
      "admin"
    ) {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/parent/dashboard"
        replace
      />
    );
  }

  return children;
}
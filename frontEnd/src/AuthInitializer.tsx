import { useEffect } from "react";
import { useAuth } from "./Hooks/useAuth";

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  return <>{children}</>;
};
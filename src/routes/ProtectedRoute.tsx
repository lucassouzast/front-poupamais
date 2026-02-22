import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthStore } from "../stores/authStore";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

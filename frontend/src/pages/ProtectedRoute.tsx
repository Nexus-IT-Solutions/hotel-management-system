//import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const data =JSON.parse(localStorage.getItem("userData") || "null");

  if (!data || !data.token) {
    console.warn("No token found, redirecting...");
    // return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

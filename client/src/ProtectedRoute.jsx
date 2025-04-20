import { Navigate, Outlet } from "react-router";
import { useAuth } from "./context/AuthContext";
import Loader from "@/components/icos/Loader";

const ProtectedRoute = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return <Loader />;
  if (!loading && !isAuthenticated) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default ProtectedRoute;

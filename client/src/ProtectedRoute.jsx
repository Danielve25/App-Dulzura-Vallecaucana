import { Navigate, Outlet } from "react-router";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading)
    return (
      <div className="h-[100vh] w-full flex justify-center items-center">
        <div className="loader"></div>
      </div>
    );
  if (!loading && !isAuthenticated) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default ProtectedRoute;

import useAuth from "src/hooks/useAuth";
import { Outlet, Navigate } from "react-router-dom";

const AuthVerification = () => {
  const isAuthenticated = useAuth();
  // // console.log(`isAuthenticated: ${isAuthenticated}`);
  return !isAuthenticated ? <Navigate to="/login" replace /> : <Outlet />;
};

export default AuthVerification;

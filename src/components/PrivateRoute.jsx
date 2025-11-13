import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "./Spinner";

export default function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <Spinner />;

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
}

import React, { useContext } from "react";
import { authContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useAuth } from "../newApp/modules/auth/useAuth";
import Loading from "../components/Loader/Loading";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role } = useContext(authContext);
  const { isLoading, token, user } = useAuth((state) => state);

  const isAllowed = allowedRoles.includes(user?.role);
  const accessibleRoute = isLoading ? (
    <Loading />
  ) : token && isAllowed ? (
    children
  ) : (
    <Navigate
      to="/"
      replace={true}
    />
  );
  return accessibleRoute;
};

export default ProtectedRoute;

import React, { ReactElement, useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

interface Props {
  children: ReactElement;
}

const ProtectedRoute = ({ children }: Props) => {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return <div>{children}</div>;
};

export default ProtectedRoute;

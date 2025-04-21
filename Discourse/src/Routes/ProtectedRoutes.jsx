import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ role, alloweroles, children }) => {
  if (!role || !alloweroles.includes(role)) {
    return <Navigate to="/not-authorized" replace />;
  }
  
  return children;
};

export default ProtectedRoutes;

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useContext(AuthContext);

  console.log("isLoggedIn:", isLoggedIn); // Debugging `isLoggedIn`

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return children;
}

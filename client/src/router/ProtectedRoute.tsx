import type {
  ReactNode
} from "react";

import {
  Navigate,
  useLocation
} from "react-router-dom";

import useAuth
  from "../hooks/useAuth";

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({
  children
}: Props) => {
  const {
    authenticated,
    user
  } = useAuth();

  const location =
    useLocation();

  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname
        }}
      />
    );
  }

  if (
    user?.mustChangePassword &&
    location.pathname !==
      "/change-password"
  ) {
    return (
      <Navigate
        to="/change-password"
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

import type {
  ReactNode
} from "react";

import {
  Navigate
} from "react-router-dom";

import useAuth
  from "../hooks/useAuth";

import type {
  UserRole
} from "../types/user";

interface Props {
  allowedRoles: UserRole[];
  children: ReactNode;
}

const RoleProtectedRoute = ({
  allowedRoles,
  children
}: Props) => {
  const {
    user,
    authenticated
  } = useAuth();

  if (!authenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    !allowedRoles.includes(
      user.role
    )
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;

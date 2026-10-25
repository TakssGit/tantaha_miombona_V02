import {
  Navigate
} from "react-router-dom";

import useAuth
  from "../hooks/useAuth";

import DashboardPage
  from "./DashboardPage";

const RoleHomePage = () => {
  const { user } =
    useAuth();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    user.role ===
    "POINT_FOCAL"
  ) {
    return (
      <Navigate
        to="/point-focal"
        replace
      />
    );
  }

  if (
    user.role ===
    "PRODUCTEUR"
  ) {
    return (
      <Navigate
        to="/espace-producteur"
        replace
      />
    );
  }

  if (
    user.role ===
    "DISTRIBUTEUR"
  ) {
    return (
      <Navigate
        to="/espace-commercial"
        replace
      />
    );
  }

  return <DashboardPage />;
};

export default RoleHomePage;

import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="login-layout">
      <Outlet />
    </main>
  );
};

export default AuthLayout;

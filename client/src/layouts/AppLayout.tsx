import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="app-main">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <div className="app-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;

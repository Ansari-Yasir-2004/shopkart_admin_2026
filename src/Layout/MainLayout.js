import { useState } from "react";
import Header from "../Components/Header";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (window.innerWidth > 768) {
      return true;
    } else {
      return false;
    }
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout-root">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`layout-main ${sidebarOpen ? "expanded" : "collapsed"}`}>
        <div className={`layout-header`}>
          <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        </div>

        <div className="layout-content">
          <Container fluid className="layout-container">
            <Outlet />
          </Container>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;

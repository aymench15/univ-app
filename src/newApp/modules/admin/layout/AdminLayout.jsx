import React from "react";
import { AdminSidebar } from "../components/AdminSidebar";
import { Outlet } from "react-router-dom";
import { Container } from "rsuite";
import "rsuite/Container/styles/index.css";

export const AdminLayout = () => {
  return (
    <Container className="container">
      <div className="w-full h-full flex gap-10 flex-wrap">
        {/* Navigation */}
        <AdminSidebar />
        {/* Content */}
        <div className="h-full flex-1">
          <Outlet />
        </div>
      </div>
    </Container>
    // <div className=" container">
    // </div>
  );
};

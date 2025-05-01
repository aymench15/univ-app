import React from "react";
import { FaTabletScreenButton, FaUserInjured } from "react-icons/fa6";
import { LuUsers } from "react-icons/lu";
import { MdDashboard, MdOutlineAdminPanelSettings } from "react-icons/md";
import { Link } from "react-router-dom";
import { Nav, Sidenav } from "rsuite";
import "rsuite/Nav/styles/index.css";
import "rsuite/Sidenav/styles/index.css";

const panelStyles = {
  padding: "15px 20px",
  color: "#aaa",
};

const navItemStyles = {
  display: "flex",
  alignItems: "center",
};

export const AdminSidebar = () => {
  const [activeKey, setActiveKey] = React.useState("1");

  return (
    <div className="rounded-lg w-full md:w-3/12">
      <Sidenav
        expanded={true}
        className=""
      >
        <Sidenav.Body>
          <Nav
            activeKey={activeKey}
            onSelect={setActiveKey}
          >
            <Nav.Item divider />
            <Nav.Item
              panel
              style={panelStyles}
            >
              Administration
            </Nav.Item>
            <Nav.Item
              as={Link}
              to="/admin/dashboard"
              eventKey="1"
              icon={
                <MdDashboard
                  className="block"
                  size={24}
                />
              }
              className="flex items-center gap-2"
              style={navItemStyles}
            >
              Tableau de bord
            </Nav.Item>
            {/* <Nav.Item
              as={Link}
              to="/admin/doctors"
              eventKey="2"
              icon={<LuUsers size={24} />}
              className="flex items-center gap-2"
              style={navItemStyles}
            >
              List of doctors
            </Nav.Item> */}
            <Nav.Item
              as={Link}
              to="/admin/patients"
              eventKey="2"
              icon={<FaUserInjured size={24} />}
              className="flex items-center gap-2"
              style={navItemStyles}
            >
              List of users
            </Nav.Item>
            <Nav.Item
              as={Link}
              to="/admin/emails"
              eventKey="3"
              icon={<FaTabletScreenButton size={24} />}
              className="flex items-center gap-2"
              style={navItemStyles}
            >
              List of accepted emails
            </Nav.Item>
            <Nav.Item
              as={Link}
              to="/admin/admins"
              eventKey="4"
              icon={<MdOutlineAdminPanelSettings size={24} />}
              className="flex items-center gap-2"
              style={navItemStyles}
            >
              List of administrators
            </Nav.Item>
          </Nav>
        </Sidenav.Body>
        {/* <Sidenav.Toggle onToggle={expanded => setExpanded(expanded)} /> */}
      </Sidenav>
    </div>
  );
};

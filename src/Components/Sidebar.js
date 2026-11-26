import {
  Button,
  Nav
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../ReduxManager/action";
import Swal from "sweetalert2";
import {
  FaTachometerAlt,
  FaBox,
  FaList,
  FaUsers,
  FaImage,
  FaEnvelope,
  FaUserShield,
  FaSignOutAlt,
  FaFirstOrder,
  FaTimes,
} from "react-icons/fa";
import { FaBars } from "react-icons/fa6";

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch(logoutUser());
        navigate("/login");
      }
    });
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "Admins", path: "/admins", icon: <FaUserShield /> },
    { name: "Brands", path: "/brands", icon: <FaBox /> },
    { name: "Categories", path: "/categories", icon: <FaList /> },
    { name: "SubCategories", path: "/subcategories", icon: <FaList /> },
    { name: "Products", path: "/products", icon: <FaBox /> },
    {
      name: "ProductSpecification",
      path: "/productSpecification",
      icon: <FaList />,
    },
    { name: "AppBanner", path: "/appBanner", icon: <FaImage /> },
    { name: "Enquiries", path: "/enquiries", icon: <FaEnvelope /> },
    { name: "Users", path: "/users", icon: <FaUsers /> },
    { name: "Contact", path: "/contactUs", icon: <FaEnvelope /> },
    { name: "Orders", path: "/orders", icon: <FaFirstOrder /> },
  ];

  return (
    <div className={`sidebar-root ${sidebarOpen ? "expanded" : "collapsed"}`}>

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-box">SK</div>
        {sidebarOpen && <span className="logo-text">ShopKart</span>}
        {sidebarOpen && (
          <button className="icon-btn ms-auto d-lg-none" onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        )}
      </div>

      {/* Menu */}
      <div className="sidebar-scroll">
        <Nav className={`menu-list ${sidebarOpen ? "expanded" : "collapsed"}`}>

          {menuItems.map((item, index) => {
            const active = location.pathname === item.path;

            return (
              <Nav.Link
                as={Link}
                to={item.path}
                key={index}
                className={`menu-item ${active ? "active" : ""} ${sidebarOpen ? "expanded" : "collapsed"}`}
              >
                <span className="menu-icon">{item.icon}</span>
                {sidebarOpen && <span className="menu-text">{item.name}</span>}
              </Nav.Link>
            );
          })}

        </Nav>
      </div>

      {/* Logout */}
      <div className="sidebar-footer">
        <Button className="btn-outline logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          {sidebarOpen && <span>Logout</span>}
        </Button>
      </div>

    </div>
  );
};

export default Sidebar;

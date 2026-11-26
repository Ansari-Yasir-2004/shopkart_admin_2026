import React from "react";
import {
  FaSearch,
  // FaBell,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import "../assets/style/header.css"

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const userName = useSelector((state) => state.user.user_name);

  return (
    <div className="header-root">

      {/* Left */}
      <div className="header-left">
        <button className="icon-btn" onClick={toggleSidebar}>
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* <div className="team-info">
          <span className="team-name">Team 1</span>
          <span className="team-badge">Free</span>
        </div> */}
      </div>

      {/* Right */}
      <div className="header-right">

        <div className="search-box">
          <FaSearch />
          <input type="text" placeholder="Search..." />
        </div>

        {/* <div className="header-icon">🇬🇧</div> */}

        {/* <div className="header-icon notification">
          <FaBell />
          <span className="badge">4</span>
        </div> */}

        <div className="header-profile">
          <FaUserCircle />
          <span>{userName || "Admin"}</span>
        </div>

      </div>
    </div>
  );
};

export default Header;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Secure2.png";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <img src={Logo} alt="SecureBank Logo" className="logo_nav" />
        <h2>SecureBank</h2>
      </div>
      <div className="sidebar-links">
        <Link to="/dashboard" className="sidebar-link">
          <i className="fas fa-chart-bar"></i>
          <span>Dashboard</span>
        </Link>
        <Link to="/payment" className="sidebar-link">
          <i className="fas fa-credit-card"></i>
          <span>Payments</span>
        </Link>
        <button onClick={handleLogout} className="sidebar-logout">
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
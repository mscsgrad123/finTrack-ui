import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../stylesheet/horizantalnavbar.module.css";

const HorizontalNavbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true); // State for navbar collapse

  const toggleNavbar = () => {
    setIsCollapsed((prev) => !prev); // Toggle collapse state
  };

  return (
    <nav className="horizontal-navbar">
      <h2>Fin Track</h2>
      <button className="toggle-button" onClick={toggleNavbar}>
        {isCollapsed ? "☰" : "✖"} {/* Toggle icon */}
      </button>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/transactions">Transactions</Link>
        </li>
        <li>
          <Link to="/budgets">Budgets</Link>
        </li>
        <li>
          <Link to="#">Profile</Link>
        </li>
      </ul>
    </nav>
  );
};

export default HorizontalNavbar;

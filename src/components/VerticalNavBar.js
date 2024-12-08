import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../stylesheet/verticalnavbar.css"; // Import CSS for styling

const VerticalNavbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // State to manage navbar visibility

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className={`vertical-navbar ${isCollapsed ? "collapsed" : ""}`}>
      <button className="toggle-button" onClick={toggleNavbar}>
        {isCollapsed ? "☰" : "✖"}
      </button>
      <h2 className={isCollapsed ? "hidden" : ""}>Fin Track</h2>
      <ul className={isCollapsed ? "hidden" : ""}>
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

export default VerticalNavbar;
import React from "react";
import { Link } from "react-router-dom";
import "../stylesheet/verticalnavbar.css"; // Import CSS for styling

const VerticalNavbar = () => {
  return (
    <nav className="vertical-navbar">
      <h2>Fin Track</h2>
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

export default VerticalNavbar;

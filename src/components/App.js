import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import SignUp from "./Signup";
import Login from "./Login";
import Home from "./Home";
import "../stylesheet/app.css";
import TransactionList from "./TransactionList";
import Budgets from "./Budgets";
import Dashboard from "./Dashboard";
import Profile from "./Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes without layout */}
        <Route index element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />

        {/* Routes with layout */}
        <Route element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="transactions" element={<TransactionList />} />
          <Route path="budgets" element={<Budgets />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          {/* Add more routes here if needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 768);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLinkClick = () => {
    setIsCollapsed(window.innerWidth <= 768);
  };

  return (
    <div className="layout-container">
      <nav className="horizontal-navbar">
        <h2>Fin Track</h2>
        <button className="toggle-button" onClick={toggleNavbar}>
          {isCollapsed ? "☰" : "✖"} Fin Track
        </button>
        <div className={`navbar-items ${isCollapsed ? "collapsed" : ""}`}>
          <ul>
            <li>
              <Link to="/dashboard" onClick={handleLinkClick}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/transactions" onClick={handleLinkClick}>
                Transactions
              </Link>
            </li>
            <li>
              <Link to="/budgets" onClick={handleLinkClick}>
                Budgets
              </Link>
            </li>
            <li>
              <Link to="/profile" onClick={handleLinkClick}>
                Profile
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

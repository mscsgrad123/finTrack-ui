import React from "react";
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import SignUp from "./Signup";
import Login from "./Login";
import Home from "./Home";
import VerticalNavbar from "./VerticalNavBar"; // Import your VerticalNavbar component
import "../stylesheet/app.css";
import TransactionList from "./TransactionList";
import Budgets from "./Budgets";
import Dashboard from "./Dashboard";

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
          {/* Add more routes here if needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Layout() {
  return (
    <div className="layout-container">
      <VerticalNavbar /> {/* Use the VerticalNavbar component here */}
      <p />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

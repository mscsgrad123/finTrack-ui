import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import "../stylesheet/app.css";
import TransactionList from "./TransactionList";
import Budgets from "./Budgets";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import { oauthConfig } from "./Constants";

export default function App() {
  const [authToken, setAuthToken] = useState(null); // Stores the auth token
  const [loading, setLoading] = useState(true); // Handles loading state
  const [userId, setUserId] = useState();
  useEffect(() => {
    // Check for `code` in the URL or existing token in localStorage
    console.log("Client ID:", process.env.REACT_APP_CLIENT_ID);
    console.log(oauthConfig.redirectUri);
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    async function handleAuthentication() {
      try {
        if (code && !authToken) {
          // Exchange code for access token
          const tokenResponse = await fetch(oauthConfig.tokenEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              client_id: oauthConfig.clientId,
              client_secret: oauthConfig.clientSecret,
              code,
              redirect_uri: oauthConfig.redirectUri,
              grant_type: "authorization_code",
            }),
          });
          const tokenData = await tokenResponse.json();

          if (tokenData.access_token) {
            setAuthToken(tokenData.access_token);
            localStorage.setItem("authToken", tokenData.access_token);
            window.history.replaceState({}, document.title, "/"); // Clean the URL
          } else {
            throw new Error("Access token missing in token response");
          }
        } else {
          const token = localStorage.getItem("authToken");
          if (token) {
            setAuthToken(token);
          } else {
            throw new Error("Auth token not found in localStorage");
          }
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    handleAuthentication();
  }, [authToken]);

  if (!authToken && !loading) {
    const authUrl = `${oauthConfig.authorizationEndpoint}?client_id=${
      oauthConfig.clientId
    }&redirect_uri=${encodeURIComponent(
      oauthConfig.redirectUri
    )}&response_type=code&scope=${encodeURIComponent(
      oauthConfig.scope
    )}&prompt=login`;
    window.location.href = authUrl;
    return null;
  }

  if (loading) {
    return <h1>loading....</h1>; // Render nothing while checking authentication
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard userId={userId} />} />
          <Route path="dashboard" element={<Dashboard userId={userId} />} />
          <Route
            path="transactions"
            element={<TransactionList userId={userId} />}
          />
          <Route path="budgets" element={<Budgets userId={userId} />} />
          <Route
            path="profile"
            element={<Profile setAuthToken={setAuthToken} userId={userId} />}
          />
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

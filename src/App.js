import React, { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  NavLink,
} from "react-router-dom";
import { FaMoneyBill, FaTint, FaFireAlt, FaSignOutAlt, FaSmile } from "react-icons/fa";
import Login from "./Login";
import Signup from "./Signup";
import Logout from "./Logout";
import MainApp from "./MainApp";
import Calories from "./CaloriesTracker/Calories";
import WaterTracker from "./trackers/WaterTracker";
import { validateToken } from "./API/APIService"

// Placeholder Expenditure component
function Expenditure() {
  return <div className="content">Expenditure Page</div>;
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function autoLogin() {
      const userName = localStorage.getItem("userName");
      try {
        await validateToken();
        if (userName) setUser(userName);
      } catch {
        handleLogout();
      }
    }

    autoLogin();
  }, []);

  function handleLogin(name) {
    setUser(name);
  }

  function handleSignup(name) {
    setUser(name);
  }

  function handleLogout() {
    setUser(null);
    localStorage.clear();

  }

  return (
    <>
    <Router>
      <div className="app-container">
        {user && (
          <aside className="sidebar">
            {user && (
              <div className="welcome-bar">
                 {/* <FaSmile style={{ marginRight: '8px' }} /> */}
                👋 Welcome, {user}!
              </div>
            )}
            <h3 className="sidebar-title">Trackers</h3>
            <nav className="sidebar-nav">
              <NavLink to="/" className="nav-link">
              <FaMoneyBill style={{ marginRight: "8px" }} />
                Expenditure
              </NavLink>
              <NavLink to="/waterTracker" className="nav-link">
                <FaTint style={{ marginRight: "8px" }} />
                Water Intake
              </NavLink>
              {/* <NavLink to="/calories" className="nav-link">
               <FaFireAlt style={{ marginRight: "8px" }} />
                Calories
              </NavLink> */}
              <button onClick={handleLogout} className="logout-btn">
                 <FaSignOutAlt style={{ marginRight: "8px", }} />
                Logout
              </button>
            </nav>
          </aside>
        )}

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={user ? <MainApp /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/calories"
              element={user ? <Calories /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/login"
              element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup onSignup={handleSignup} /> : <Navigate to="/" replace />}
            />
            <Route
              path="/logout"
              element={user ? <Logout onLogout={handleLogout} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/waterTracker"
              element={user ? <WaterTracker /> : <Navigate to="/login" replace />}
            />
            <Route path="/expenditure" element={<Expenditure />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
    <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

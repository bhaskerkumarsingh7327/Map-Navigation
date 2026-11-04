// src/components/Navbar/Navbar.jsx
import React, { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { searchLocation } from "../../services/api";
import {
  FaSearch,
  FaMapMarkedAlt,
  FaMoon,
  FaSun,
  FaUserCircle,
  FaCircle,
  FaTimes
} from "react-icons/fa";
import "./Navbar.css";

export default function Navbar() {
  const {
    calculateRoute,
    setDestination,
    destination,
    source,
    mapTheme,
    setMapTheme
  } = useNavigation();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Clock
  useEffect(() => {
    const t = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = async (val) => {
    setQuery(val);
    if (val.trim().length > 1) {
      const hits = await searchLocation(val);
      setResults(hits);
    } else {
      setResults([]);
    }
  };

  const handleSelectPlace = (item) => {
    setDestination(item.displayName || item.name);
    setQuery("");
    setResults([]);
    calculateRoute(source, item);
  };

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    setMapTheme(nextDark ? "dark" : "standard");
    if (nextDark) {
      document.body.classList.add("dark-mode-theme");
    } else {
      document.body.classList.remove("dark-mode-theme");
    }
  };

  return (
    <header className="global-navbar">
      {/* Brand & Status */}
      <div className="navbar-brand-section">
        <div className="navbar-logo-badge">
          <img src="/favicon.svg" alt="Google Maps Logo" style={{ width: "24px", height: "32px", objectFit: "contain" }} />
        </div>
        <div className="navbar-brand-text">
          <h2>Google Navigation</h2>
          <div className="engine-status-line">
            <FaCircle className="status-live-dot" />
            <span>Maps Simulator Core • Live GPS</span>
          </div>
        </div>
      </div>

      {/* Global Search Bar with Live Suggestions */}
      <div className="navbar-global-search">
        <FaSearch className="global-search-icon" />
        <input
          type="text"
          placeholder="Search any place, city, or destination globally..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {query && (
          <button className="navbar-clear-btn" onClick={() => { setQuery(""); setResults([]); }}>
            <FaTimes />
          </button>
        )}

        {results.length > 0 && (
          <div className="navbar-search-dropdown">
            {results.map((res, i) => (
              <div
                key={`nav-res-${i}`}
                className="navbar-dropdown-row"
                onClick={() => handleSelectPlace(res)}
              >
                <strong>{res.name}</strong>
                <span>{res.displayName}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls: Clock, Theme, Profile */}
      <div className="navbar-right-controls">
        <div className="navbar-time-chip">
          <span>{currentTime}</span>
        </div>

        <button
          className="btn-theme-switch-toggle"
          onClick={toggleTheme}
          title="Toggle Dark / Light Mode"
        >
          {isDark ? <FaSun className="theme-sun-icon" /> : <FaMoon />}
          <span>{isDark ? "Light" : "Dark"}</span>
        </button>

        <div className="user-profile-meta-chip">
          <FaUserCircle className="user-avatar-icon" />
          <span className="user-display-name">Bhasker Kumar Singh</span>
        </div>
      </div>
    </header>
  );
}

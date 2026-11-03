// src/components/Sidebar/Sidebar.jsx
import React, { useState } from "react";
import {
  FaCompass,
  FaRoute,
  FaHistory,
  FaBookmark,
  FaTrafficLight,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaCog,
  FaBolt
} from "react-icons/fa";
import "./Sidebar.css";

export default function Sidebar({ activeTab, setActiveTab }) {
  const [isSystemOnline, setIsSystemOnline] = useState(true);

  const menuItems = [
    { key: "Home", label: "Explore & Routes", icon: <FaCompass /> },
    { key: "Navigation", label: "DSA Engine Lab", icon: <FaRoute /> },
    { key: "Nearby", label: "Nearby POIs", icon: <FaMapMarkerAlt /> },
    { key: "Saved", label: "Saved Places", icon: <FaBookmark /> },
    { key: "History", label: "Trip History", icon: <FaHistory /> },
    { key: "Traffic", label: "Traffic Density", icon: <FaTrafficLight /> },
    { key: "Settings", label: "Preferences", icon: <FaCog /> },
    { key: "About", label: "System Specs", icon: <FaInfoCircle /> }
  ];

  const handleSystemInitialization = () => {
    setIsSystemOnline(true);
    const event = new CustomEvent("systemInitTriggered", {
      detail: { timestamp: new Date().toLocaleTimeString() }
    });
    window.dispatchEvent(event);
  };

  return (
    <aside className="apple-sidebar-container">
      {/* Brand Header */}
      <div className="sidebar-brand-wrapper">
        <div className="brand-vector-icon">
          <div className="inner-pulse-core"></div>
        </div>
        <div className="brand-title-meta">
          <h2>Maps Engine</h2>
          <span>Google Navigation</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav-list">
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`sidebar-nav-btn ${activeTab === item.key ? "is-active-pill" : ""}`}
            onClick={() => setActiveTab(item.key)}
          >
            <span className="nav-menu-icon">{item.icon}</span>
            <span className="nav-btn-text">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer System Status Card */}
      <div className="sidebar-footer-cta">
        <div className="cta-icon-badge">
          <FaBolt />
        </div>
        <h4>DSA Core Active</h4>
        <p>C++ Dijkstra & Live OSM Adjacency routing pipeline ready.</p>

        <button
          className={`cta-action-trigger ${isSystemOnline ? "system-active-glow" : ""}`}
          onClick={handleSystemInitialization}
        >
          {isSystemOnline ? "● System Online" : "Initialize System"}
        </button>
      </div>
    </aside>
  );
}

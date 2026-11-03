// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import MapView from "../components/Map/MapView";
import SearchPanel from "../components/SearchPanel/SearchPanel";
import RoutePanel from "../components/RoutePanel/RoutePanel";
import BottomCards from "../components/BottomCards/BottomCards";

// Subpages
import NavigationPage from "./NavigationPage";
import HistoryPage from "./HistoryPage";
import TrafficPage from "./TrafficPage";
import SavedPage from "./SavedPage";
import NearbyPage from "./NearbyPage";
import SettingsPage from "./SettingsPage";

import { useNavigation } from "../context/NavigationContext";
import "./Home.css";

export default function Home() {
  const { isNavigating, isRoutePanelOpen } = useNavigation();
  const [activeTab, setActiveTab] = useState("Home");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const handleSystemInit = (e) => {
      setNotification({
        message: "DSA Optimization Engine Synced",
        time: e.detail.timestamp,
        status: "Active"
      });

      setTimeout(() => {
        setNotification(null);
      }, 4000);
    };

    window.addEventListener("systemInitTriggered", handleSystemInit);
    return () => window.removeEventListener("systemInitTriggered", handleSystemInit);
  }, []);

  return (
    <div className="enterprise-root-view">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="workspace-pipeline">
        <Navbar />

        <div className="google-viewport-canvas-wrapper">
          {activeTab === "Home" && (
            <div className="google-map-immersive-container">
              <MapView />

              {/* Floating Google Navigation Panel (Top-Left) */}
              {!isNavigating && (
                <div className="google-floating-side-pane">
                  <SearchPanel />
                  {isRoutePanelOpen && <RoutePanel />}
                </div>
              )}

              {/* Floating Bottom Diagnostic & Weather Bar */}
              {!isNavigating && (
                <div className="google-floating-bottom-dock">
                  <BottomCards />
                </div>
              )}
            </div>
          )}

          {activeTab === "Navigation" && (
            <div className="full-width-subpage-cell">
              <NavigationPage />
            </div>
          )}
          {activeTab === "History" && (
            <div className="full-width-subpage-cell">
              <HistoryPage setActiveTab={setActiveTab} />
            </div>
          )}
          {activeTab === "Traffic" && (
            <div className="full-width-subpage-cell">
              <TrafficPage setActiveTab={setActiveTab} />
            </div>
          )}
          {activeTab === "Saved" && (
            <div className="full-width-subpage-cell">
              <SavedPage setActiveTab={setActiveTab} />
            </div>
          )}
          {activeTab === "Nearby" && (
            <div className="full-width-subpage-cell">
              <NearbyPage setActiveTab={setActiveTab} />
            </div>
          )}
          {activeTab === "Settings" && (
            <div className="full-width-subpage-cell">
              <SettingsPage />
            </div>
          )}

          {activeTab === "About" && (
            <div className="full-width-subpage-cell">
              <div className="dynamic-subpage-view-wrapper fade-blur-entrance">
                <div className="module-intro-meta">
                  <h1>Google Navigation Architecture Specifications</h1>
                  <p>Enterprise layout configurations for the optimization core dashboard.</p>
                </div>

                <div className="interactive-runtime-console" style={{ marginTop: "20px" }}>
                  <div className="console-control-row">
                    <div className="window-action-buttons">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span>PLATFORM_METRICS_LOG</span>
                  </div>
                  <div className="console-output-stream" style={{ padding: "28px" }}>
                    <p><span className="token-blue">[APPLICATION]:</span> Google Navigation Simulator Engine v2.0 Production Ready</p>
                    <p><span className="token-blue">[FRONTEND]:</span> React 19 + Leaflet Interactive Tiles & Navigation HUD</p>
                    <p><span className="token-blue">[BACKEND]:</span> Express.js High-Resilience Server with In-Memory fallback</p>
                    <p><span className="token-green">[ALGORITHMS]:</span> Native Clang C++17 Dijkstra Engine with Adjacency Matrix</p>
                    <p><span className="token-green">[ROUTING]:</span> Real-time Road Routing (OSRM) + OpenStreetMap Geocoding & POIs</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Toast Alert */}
        {notification && (
          <div className="apple-toast-alert-card premium-fade-in">
            <div className="toast-pulse-green"></div>
            <div className="toast-text-content">
              <h4>{notification.message}</h4>
              <p>Core status initialized at {notification.time} successfully.</p>
            </div>
          </div>
        )}

        <footer className="global-system-footer">
          <span>&copy; 2026 Google Navigation Simulator Framework &bull; Designed & Built with ❤️ for Bhasker Kumar Singh</span>
        </footer>
      </div>
    </div>
  );
}

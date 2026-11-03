// src/pages/SettingsPage.jsx
import React, { useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import { FaTrash, FaVolumeUp, FaMap, FaRoute, FaCheck } from "react-icons/fa";
import "./SettingsPage.css";

export default function SettingsPage() {
  const {
    travelMode,
    setTravelMode,
    mapTheme,
    setMapTheme,
    isMuted,
    setIsMuted,
    clearHistory
  } = useNavigation();

  const [unit, setUnit] = useState("km");
  const [avoidTolls, setAvoidTolls] = useState(false);
  const [toast, setToast] = useState(null);

  const handleClearAll = () => {
    clearHistory();
    setToast("History and routing cache cleared successfully!");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="dynamic-subpage-view-wrapper fade-blur-entrance">
      <div className="module-intro-meta">
        <h1>Navigation Simulator Preferences</h1>
        <p>Configure navigation options, voice guidance, measurement units, and map layers.</p>
      </div>

      <div className="settings-split-column-frame">
        {/* Navigation & Voice Guidance */}
        <div className="settings-card-group-wrapper">
          <h3>Navigation & Audio</h3>

          <div className="switch-flex-row-item">
            <div>
              <strong>Voice Turn-by-Turn Guidance</strong>
              <p>Speak directional maneuvers and turn announcements aloud during navigation.</p>
            </div>
            <div
              className={`switch-toggle-track ${!isMuted ? "track-is-on" : ""}`}
              onClick={() => setIsMuted(!isMuted)}
            >
              <div className="switch-toggle-thumb-node"></div>
            </div>
          </div>

          <div className="switch-flex-row-item">
            <div>
              <strong>Avoid Highway Toll Roads</strong>
              <p>Prefer toll-free secondary highways when calculating routes.</p>
            </div>
            <div
              className={`switch-toggle-track ${avoidTolls ? "track-is-on" : ""}`}
              onClick={() => setAvoidTolls(!avoidTolls)}
            >
              <div className="switch-toggle-thumb-node"></div>
            </div>
          </div>
        </div>

        {/* Display & Measurement Units */}
        <div className="settings-card-group-wrapper">
          <h3>Units & Default Map Style</h3>

          <div className="settings-select-row">
            <div>
              <strong>Distance Units</strong>
              <p>Choose between metric kilometers or imperial miles.</p>
            </div>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="settings-native-select"
            >
              <option value="km">Kilometers (km)</option>
              <option value="mi">Miles (mi)</option>
            </select>
          </div>

          <div className="settings-select-row">
            <div>
              <strong>Default Map Layer</strong>
              <p>Initial map rendering style on load.</p>
            </div>
            <select
              value={mapTheme}
              onChange={(e) => setMapTheme(e.target.value)}
              className="settings-native-select"
            >
              <option value="standard">Google Clean Street</option>
              <option value="satellite">Satellite / Hybrid</option>
              <option value="dark">Carto Dark Matter (Night)</option>
              <option value="terrain">OpenTopoMap (Terrain)</option>
            </select>
          </div>

          <div className="settings-select-row">
            <div>
              <strong>Default Travel Mode</strong>
              <p>Primary mode selected on startup.</p>
            </div>
            <select
              value={travelMode}
              onChange={(e) => setTravelMode(e.target.value)}
              className="settings-native-select"
            >
              <option value="driving">🚗 Driving (Car)</option>
              <option value="motorcycle">🏍️ Two-Wheeler</option>
              <option value="transit">🚌 Transit</option>
              <option value="walking">🚶 Walking</option>
              <option value="cycling">🚲 Cycling</option>
            </select>
          </div>
        </div>

        {/* Storage & Reset */}
        <div className="settings-card-group-wrapper">
          <h3>Data & Storage</h3>

          <div className="switch-flex-row-item">
            <div>
              <strong>Clear Search History & Cache</strong>
              <p>Remove past logged trips from browser local storage.</p>
            </div>
            <button className="btn-settings-danger" onClick={handleClearAll}>
              <FaTrash /> Clear All Data
            </button>
          </div>
        </div>

        {toast && (
          <div className="settings-toast-banner">
            <FaCheck />
            <span>{toast}</span>
          </div>
        )}
      </div>
    </div>
  );
}

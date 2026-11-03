// src/pages/TrafficPage.jsx
import React, { useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import { FaTrafficLight, FaCheck, FaExclamationTriangle, FaCarCrash } from "react-icons/fa";
import "./TrafficPage.css";

export default function TrafficPage({ setActiveTab }) {
  const { setRouteInfo, routeInfo, setTrafficLayerActive, trafficLayerActive } = useNavigation();

  const [currentLevel, setCurrentLevel] = useState(routeInfo.trafficCondition || "Moderate Traffic");
  const [toastMessage, setToastMessage] = useState(null);

  const applyTrafficPreset = (level, delayMins, overheadRatio) => {
    setCurrentLevel(level);

    setRouteInfo(prev => {
      const baseMins = prev.travelTimeMinutes || 105;
      const newMins = Math.max(20, baseMins + delayMins);
      const hours = Math.floor(newMins / 60);
      const mins = newMins % 60;
      const formatted = hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`;

      return {
        ...prev,
        trafficCondition: level,
        estimatedTime: formatted
      };
    });

    setToastMessage(`Traffic State updated to "${level}" (Delay offset: ${delayMins >= 0 ? "+" : ""}${delayMins} min)`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="dynamic-subpage-view-wrapper fade-blur-entrance">
      <div className="module-intro-meta">
        <h1>Live Traffic Density Simulator</h1>
        <p>Observe or modify real-time edge weight factors dynamically inside the routing pipeline.</p>
      </div>

      {/* Traffic Level Status Panels */}
      <div className="traffic-indicator-panel-row">
        <div className="density-panel-box top-border-green">
          <div className="density-box-header">
            <span>Optimal Traversals</span>
            <FaCheck className="traffic-icon-green" />
          </div>
          <h2>11,840 Vertices</h2>
          <p>Standard weights allocations running smoothly. Free flow average 55 km/h.</p>
        </div>

        <div className="density-panel-box top-border-orange">
          <div className="density-box-header">
            <span>Congestion Delays</span>
            <FaExclamationTriangle className="traffic-icon-orange" />
          </div>
          <h2>2,410 Vertices</h2>
          <p>Traversal index shifted by +1.45x overhead variables. Arterial slow downs.</p>
        </div>

        <div className="density-panel-box top-border-red">
          <div className="density-box-header">
            <span>Critical Gridlocks</span>
            <FaCarCrash className="traffic-icon-red" />
          </div>
          <h2>620 Vertices</h2>
          <p>Alternative path array redirections active. Heavy peak rush slowdowns.</p>
        </div>
      </div>

      {/* Traffic Presets Controller */}
      <div className="density-modification-action-card">
        <h3>Dynamic Weight Manipulation System</h3>
        <p>Select a scenario below to test how the routing engine adapts to rush hour, accidents, or light night flow:</p>

        <div className="traffic-preset-buttons-row">
          <button
            className={`traffic-preset-pill ${currentLevel.includes("Low") ? "preset-selected" : ""}`}
            onClick={() => applyTrafficPreset("Low Traffic (Clear)", -15, 0.8)}
          >
            🟢 Low Traffic (Clear)
          </button>

          <button
            className={`traffic-preset-pill ${currentLevel.includes("Moderate") ? "preset-selected" : ""}`}
            onClick={() => applyTrafficPreset("Moderate Traffic (Typical)", 0, 1.0)}
          >
            🟡 Typical Flow (Normal)
          </button>

          <button
            className={`traffic-preset-pill ${currentLevel.includes("Heavy") ? "preset-selected" : ""}`}
            onClick={() => applyTrafficPreset("Heavy Traffic (Rush Hour Gridlock)", 28, 1.5)}
          >
            🔴 Rush Hour Gridlock (+28 min)
          </button>
        </div>

        <div className="traffic-toggle-options">
          <label className="switch-flex-label">
            <input
              type="checkbox"
              checked={trafficLayerActive}
              onChange={(e) => setTrafficLayerActive(e.target.checked)}
            />
            <span>Highlight Traffic Colors directly on Map Polyline</span>
          </label>
        </div>

        {toastMessage && (
          <div className="traffic-toast-banner">
            <FaTrafficLight />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}

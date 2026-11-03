// src/pages/HistoryPage.jsx
import React from "react";
import { useNavigation } from "../context/NavigationContext";
import { FaHistory, FaRoute, FaTrash, FaCar, FaWalking, FaBicycle, FaBus } from "react-icons/fa";
import "./HistoryPage.css";

export default function HistoryPage({ setActiveTab }) {
  const { history, clearHistory, calculateRoute, setSource, setDestination } = useNavigation();

  const handleReRoute = (log) => {
    setSource(log.from);
    setDestination(log.to);
    calculateRoute(log.from, log.to, log.mode || "driving");
    if (setActiveTab) setActiveTab("Home");
  };

  const renderModeIcon = (mode) => {
    switch (mode) {
      case "walking":
        return <FaWalking title="Walking" />;
      case "cycling":
        return <FaBicycle title="Cycling" />;
      case "transit":
        return <FaBus title="Transit" />;
      default:
        return <FaCar title="Driving" />;
    }
  };

  return (
    <div className="dynamic-subpage-view-wrapper fade-blur-entrance">
      <div className="history-header-flex">
        <div className="module-intro-meta">
          <h1>Trip History & Recent Routes</h1>
          <p>Review past calculated paths, distances, travel durations, and re-launch them with 1 click.</p>
        </div>

        {history.length > 0 && (
          <button className="btn-clear-history" onClick={clearHistory}>
            <FaTrash />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-history-state">
          <FaHistory className="empty-history-icon" />
          <p>No recent trips found. Plan a route on the map to start building your history!</p>
        </div>
      ) : (
        <div className="table-viewport-frame">
          <table className="enterprise-data-grid">
            <thead>
              <tr>
                <th>Date / Time</th>
                <th>Mode</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Distance</th>
                <th>Duration</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((log) => (
                <tr key={log.id} className="data-row-item-interactive">
                  <td>
                    <span className="log-date-txt">{log.date}</span>
                  </td>
                  <td>
                    <span className="log-mode-icon">{renderModeIcon(log.mode)}</span>
                  </td>
                  <td>
                    <span className="node-text-weight">{log.from}</span>
                  </td>
                  <td>
                    <span className="node-text-weight text-blue">{log.to}</span>
                  </td>
                  <td>
                    <strong>{log.distance}</strong>
                  </td>
                  <td>
                    <span className="cost-metric-txt">{log.duration}</span>
                  </td>
                  <td>
                    <button
                      className="btn-reroute-action"
                      onClick={() => handleReRoute(log)}
                    >
                      <FaRoute /> Re-Route
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

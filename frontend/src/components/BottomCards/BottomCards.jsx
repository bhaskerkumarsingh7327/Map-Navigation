// src/components/BottomCards/BottomCards.jsx
import React from "react";
import { useNavigation } from "../../context/NavigationContext";
import "./BottomCards.css";

export default function BottomCards() {
  const { searchNearby, activeNearbyCategory, destination, routeInfo } = useNavigation();

  const cityName = destination ? destination.split(",")[0] : "Patna";

  return (
    <div className="premium-bottom-dashboard-grid">
      {/* 1. Live Traffic Monitor Widget */}
      <div className="dashboard-widget-card-node">
        <div className="card-header-flex">
          <h4>Live Traffic Monitor</h4>
          <span className="live-badge-pulse">● Live Grid</span>
        </div>
        <p style={{ fontSize: "12px", color: "#5f6368", margin: "2px 0 6px" }}>
          Status: <strong>{routeInfo.trafficCondition || "Moderate Traffic"}</strong>
        </p>
        <div className="mock-sparkline-graph">
          <div className="spark-bar" style={{ height: "40%" }} title="Low"></div>
          <div className="spark-bar" style={{ height: "65%" }} title="Medium"></div>
          <div className="spark-bar red-spark" style={{ height: "85%" }} title="High Congestion"></div>
          <div className="spark-bar" style={{ height: "45%" }} title="Smooth"></div>
          <div className="spark-bar" style={{ height: "55%" }} title="Moderate"></div>
        </div>
      </div>

      {/* 2. Nearby Places 1-Click Filter Chips */}
      <div className="dashboard-widget-card-node">
        <h4>Discover Nearby POIs</h4>
        <div className="poi-chips-scroller">
          <button
            className={`poi-chip-interactive ${activeNearbyCategory === "Gas Stations" ? "chip-active" : ""}`}
            onClick={() => searchNearby("Gas Stations")}
          >
            ⛽ Fuel & EV
          </button>
          <button
            className={`poi-chip-interactive ${activeNearbyCategory === "Restaurants" ? "chip-active" : ""}`}
            onClick={() => searchNearby("Restaurants")}
          >
            🍽️ Food & Dining
          </button>
          <button
            className={`poi-chip-interactive ${activeNearbyCategory === "Hospitals" ? "chip-active" : ""}`}
            onClick={() => searchNearby("Hospitals")}
          >
            🏥 Hospitals
          </button>
          <button
            className={`poi-chip-interactive ${activeNearbyCategory === "Hotels" ? "chip-active" : ""}`}
            onClick={() => searchNearby("Hotels")}
          >
            🏨 Hotels
          </button>
          <button
            className={`poi-chip-interactive ${activeNearbyCategory === "ATMs" ? "chip-active" : ""}`}
            onClick={() => searchNearby("ATMs")}
          >
            🏧 ATMs
          </button>
        </div>
      </div>

      {/* 3. Live Weather Today */}
      <div className="dashboard-widget-card-node">
        <h4>Destination Weather</h4>
        <div className="weather-split-data">
          <span className="weather-temp-num">28°C</span>
          <div className="weather-location-text">
            <strong>{cityName}</strong>
            <p>Sunny & Clear &bull; Humidity: 55%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

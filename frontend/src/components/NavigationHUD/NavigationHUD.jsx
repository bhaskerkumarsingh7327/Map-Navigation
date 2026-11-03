// src/components/NavigationHUD/NavigationHUD.jsx
import React from "react";
import { useNavigation } from "../../context/NavigationContext";
import {
  FaArrowUp,
  FaArrowLeft,
  FaArrowRight,
  FaRedo,
  FaVolumeUp,
  FaVolumeMute,
  FaTimes,
  FaCrosshairs,
  FaMapMarkerAlt
} from "react-icons/fa";
import "./NavigationHUD.css";

export default function NavigationHUD() {
  const {
    isNavigating,
    stopNavigation,
    navigationProgress,
    routeInfo,
    destination,
    isMuted,
    setIsMuted,
    setMapCenter
  } = useNavigation();

  if (!isNavigating) return null;

  const {
    speed,
    remainingDistance,
    remainingTime,
    nextManeuver,
    currentLocation
  } = navigationProgress;

  const renderManeuverIcon = () => {
    const text = (nextManeuver || "").toLowerCase();
    if (text.includes("left")) return <FaArrowLeft className="hud-maneuver-icon" />;
    if (text.includes("right")) return <FaArrowRight className="hud-maneuver-icon" />;
    if (text.includes("roundabout") || text.includes("u-turn")) return <FaRedo className="hud-maneuver-icon" />;
    if (text.includes("arrive") || text.includes("destination")) return <FaMapMarkerAlt className="hud-maneuver-icon" />;
    return <FaArrowUp className="hud-maneuver-icon" />;
  };

  const handleRecenter = () => {
    if (currentLocation) {
      setMapCenter(currentLocation);
    }
  };

  return (
    <div className="google-nav-hud-overlay">
      {/* 1. Top Prominent Google Green Maneuver Card */}
      <div className="hud-top-card">
        <div className="hud-maneuver-symbol-box">
          {renderManeuverIcon()}
        </div>
        <div className="hud-maneuver-text-box">
          <span className="hud-distance-cue">In 350 m</span>
          <h2 className="hud-street-cue">{nextManeuver || "Continue on route"}</h2>
          <span className="hud-sub-cue">Towards {destination}</span>
        </div>
      </div>

      {/* 2. Floating Action Controls (Right side) */}
      <div className="hud-floating-side-tools">
        <button
          className={`hud-side-btn ${isMuted ? "btn-is-muted" : ""}`}
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? "Unmute Voice Guidance" : "Mute Voice Guidance"}
        >
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>

        <button
          className="hud-side-btn"
          onClick={handleRecenter}
          title="Recenter Camera on Vehicle"
        >
          <FaCrosshairs />
        </button>

        <div className="hud-speedometer-badge">
          <strong>{speed}</strong>
          <span>km/h</span>
        </div>
      </div>

      {/* 3. Bottom Trip Status & Exit Bar */}
      <div className="hud-bottom-bar">
        <div className="hud-eta-group">
          <div className="hud-eta-time">{remainingTime}</div>
          <div className="hud-eta-meta">
            <span className="hud-eta-dist">{remainingDistance}</span>
            <span className="hud-eta-dot">•</span>
            <span className="hud-eta-arrival">{routeInfo.arrivalTime}</span>
          </div>
        </div>

        <button className="hud-exit-btn" onClick={stopNavigation}>
          <FaTimes />
          <span>Exit</span>
        </button>
      </div>
    </div>
  );
}


// src/components/RoutePanel/RoutePanel.jsx
import React, { useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import {
  FaClock,
  FaRoad,
  FaGasPump,
  FaTrafficLight,
  FaRoute,
  FaPlay,
  FaBookmark,
  FaShareAlt,
  FaChevronDown,
  FaChevronUp,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaRedo,
  FaMapMarkerAlt,
  FaCheck
} from "react-icons/fa";
import "./RoutePanel.css";

export default function RoutePanel() {
  const {
    source,
    destination,
    routeInfo,
    steps,
    alternativeRoutes,
    activeRouteIndex,
    selectAlternativeRoute,
    startNavigation,
    isNavigating,
    savePlace,
    setIsRoutePanelOpen
  } = useNavigation();

  const [stepsExpanded, setStepsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveRoute = () => {
    savePlace({
      name: `${source.split(",")[0]} to ${destination.split(",")[0]}`,
      category: "Saved Routes",
      address: `${routeInfo.distance} • ${routeInfo.estimatedTime}`
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const renderStepIcon = (iconType) => {
    switch (iconType) {
      case "left":
        return <FaArrowLeft className="step-icon step-icon-turn" />;
      case "right":
        return <FaArrowRight className="step-icon step-icon-turn" />;
      case "roundabout":
      case "uturn":
        return <FaRedo className="step-icon step-icon-turn" />;
      case "finish":
        return <FaMapMarkerAlt className="step-icon step-icon-dest" />;
      default:
        return <FaArrowUp className="step-icon step-icon-straight" />;
    }
  };

  return (
    <div className="google-route-overview-panel">
      {/* 1. Header ETA & Summary */}
      <div className="panel-summary-card">
        <div className="summary-headline-row">
          <div className="time-eta-block">
            <span className="big-eta-time">{routeInfo.estimatedTime}</span>
            <span className="small-eta-arrival">({routeInfo.arrivalTime})</span>
          </div>
          <div className="headline-right-actions">
            <div className={`traffic-badge-pill ${routeInfo.trafficCondition?.includes("Heavy") ? "traffic-heavy" : "traffic-normal"}`}>
              ● {routeInfo.trafficCondition}
            </div>
            <button
              type="button"
              className="btn-close-route-panel"
              onClick={() => setIsRoutePanelOpen(false)}
              title="Minimize Route Details"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="summary-meta-row">
          <span className="meta-distance">{routeInfo.distance}</span>
          <span className="meta-dot">•</span>
          <span className="meta-road-type">{routeInfo.roadType}</span>
        </div>

        {/* 2. Main Google "Start" Navigation Action Button */}
        <button
          className={`btn-start-navigation ${isNavigating ? "is-active-nav" : ""}`}
          onClick={startNavigation}
        >
          <FaPlay className="play-icon-tri" />
          <span>{isNavigating ? "Navigation in Progress" : "Start Navigation"}</span>
        </button>

        {/* 3. Quick Actions: Save & Share */}
        <div className="route-quick-actions-row">
          <button
            type="button"
            className={`quick-action-pill ${saved ? "action-done" : ""}`}
            onClick={handleSaveRoute}
          >
            {saved ? <FaCheck /> : <FaBookmark />}
            <span>{saved ? "Saved" : "Save Route"}</span>
          </button>

          <button
            type="button"
            className={`quick-action-pill ${copied ? "action-done" : ""}`}
            onClick={handleShare}
          >
            {copied ? <FaCheck /> : <FaShareAlt />}
            <span>{copied ? "Link Copied" : "Share"}</span>
          </button>
        </div>
      </div>

      {/* 4. Alternative Routes Options */}
      {alternativeRoutes && alternativeRoutes.length > 0 && (
        <div className="alt-routes-selector-box">
          <h4 className="alt-section-title">Route Choices</h4>
          <div className="alt-cards-stack">
            {/* Primary Route */}
            <div
              className={`alt-route-card ${activeRouteIndex === 0 ? "alt-card-selected" : ""}`}
              onClick={() => selectAlternativeRoute(0)}
            >
              <div className="alt-card-left">
                <strong>Primary Route</strong>
                <span>Fastest route with typical traffic</span>
              </div>
              <div className="alt-card-right">
                <span className="alt-time-text">{routeInfo.estimatedTime}</span>
                <span className="alt-dist-text">{routeInfo.distance}</span>
              </div>
            </div>

            {/* Alternative routes from engine */}
            {alternativeRoutes.map((alt, idx) => (
              <div
                key={`alt-choice-${idx}`}
                className={`alt-route-card ${activeRouteIndex === idx + 1 ? "alt-card-selected" : ""}`}
                onClick={() => selectAlternativeRoute(idx + 1)}
              >
                <div className="alt-card-left">
                  <strong>{alt.name}</strong>
                  <span className="alt-diff-warning">{alt.diffText || "Alternative Path"}</span>
                </div>
                <div className="alt-card-right">
                  <span className="alt-time-text">{alt.estimatedTime}</span>
                  <span className="alt-dist-text">{alt.distance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Route Diagnostics & Resource Metrics */}
      <div className="route-diagnostics-metrics-grid">
        <div className="metric-box">
          <FaGasPump className="metric-icon" />
          <div className="metric-text-group">
            <span className="metric-label">Estimated Fuel</span>
            <strong>{routeInfo.fuelEstimate || "≈ 5.8 L"}</strong>
          </div>
        </div>

        <div className="metric-box">
          <FaRoad className="metric-icon" />
          <div className="metric-text-group">
            <span className="metric-label">Toll Passages</span>
            <strong>{routeInfo.tollCount || "No Tolls"}</strong>
          </div>
        </div>
      </div>

      {/* 6. Step-by-Step Directions Accordion */}
      <div className="turn-by-turn-accordion-container">
        <div
          className="accordion-header-toggle"
          onClick={() => setStepsExpanded(!stepsExpanded)}
        >
          <div className="accordion-title-flex">
            <FaRoute className="route-accordion-icon" />
            <h4>Step-by-Step Directions ({steps.length})</h4>
          </div>
          {stepsExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {stepsExpanded && (
          <div className="steps-timeline-list">
            {steps.map((step, index) => (
              <div key={`step-row-${step.id || index}`} className="step-timeline-item">
                <div className="step-icon-spine">
                  <div className="step-icon-circle">
                    {renderStepIcon(step.icon)}
                  </div>
                  {index < steps.length - 1 && <div className="spine-vertical-bar"></div>}
                </div>
                <div className="step-body-content">
                  <p className="step-instruction-text">{step.instruction}</p>
                  <div className="step-sub-metrics">
                    <span>{step.distance}</span>
                    <span>&bull;</span>
                    <span>{step.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

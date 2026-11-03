// src/components/SearchPanel/SearchPanel.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { searchLocation, PREDEFINED_LOCATIONS } from "../../services/api";
import {
  FaCar,
  FaMotorcycle,
  FaWalking,
  FaBicycle,
  FaBus,
  FaExchangeAlt,
  FaCrosshairs,
  FaTimes,
  FaSearch,
  FaRoute,
  FaMapMarkerAlt,
  FaHistory
} from "react-icons/fa";
import "./SearchPanel.css";

export default function SearchPanel() {
  const {
    source,
    setSource,
    sourceCoords,
    setSourceCoords,
    destination,
    setDestination,
    destinationCoords,
    setDestinationCoords,
    travelMode,
    setTravelMode,
    routePreference,
    setRoutePreference,
    routingEngine,
    setRoutingEngine,
    calculateRoute,
    swapLocations,
    useCurrentLocation,
    loading,
    isRoutePanelOpen,
    setIsRoutePanelOpen,
    routeInfo
  } = useNavigation();

  // Autocomplete suggestions states
  const [sourceQuery, setSourceQuery] = useState(source);
  const [destQuery, setDestQuery] = useState(destination);
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'source' or 'dest' or null

  const sourceDebounceRef = useRef(null);
  const destDebounceRef = useRef(null);

  // Sync internal query states when context updates
  useEffect(() => {
    setSourceQuery(source);
  }, [source]);

  useEffect(() => {
    setDestQuery(destination);
  }, [destination]);

  // Handle typing in Source input
  const handleSourceChange = (e) => {
    const val = e.target.value;
    setSourceQuery(val);
    setActiveDropdown("source");

    if (sourceDebounceRef.current) clearTimeout(sourceDebounceRef.current);
    sourceDebounceRef.current = setTimeout(async () => {
      if (val.trim().length > 1) {
        const results = await searchLocation(val);
        setSourceSuggestions(results);
      } else {
        setSourceSuggestions([]);
      }
    }, 250);
  };

  // Handle typing in Destination input
  const handleDestChange = (e) => {
    const val = e.target.value;
    setDestQuery(val);
    setActiveDropdown("dest");

    if (destDebounceRef.current) clearTimeout(destDebounceRef.current);
    destDebounceRef.current = setTimeout(async () => {
      if (val.trim().length > 1) {
        const results = await searchLocation(val);
        setDestSuggestions(results);
      } else {
        setDestSuggestions([]);
      }
    }, 250);
  };

  // Select suggestion for source
  const handleSelectSource = (item) => {
    setSource(item.displayName || item.name);
    setSourceQuery(item.displayName || item.name);
    setSourceCoords([item.lat, item.lng]);
    setSourceSuggestions([]);
    setActiveDropdown(null);
    calculateRoute(item, destination);
  };

  // Select suggestion for destination
  const handleSelectDest = (item) => {
    setDestination(item.displayName || item.name);
    setDestQuery(item.displayName || item.name);
    setDestinationCoords([item.lat, item.lng]);
    setDestSuggestions([]);
    setActiveDropdown(null);
    calculateRoute(source, item);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setActiveDropdown(null);
    calculateRoute(sourceQuery, destQuery);
  };

  // Quick preset chips selection
  const handlePresetClick = (locName) => {
    const found = PREDEFINED_LOCATIONS.find(l => l.name.toLowerCase() === locName.toLowerCase());
    if (found) {
      setDestination(found.name);
      setDestQuery(found.name);
      setDestinationCoords([found.lat, found.lng]);
      calculateRoute(source, found);
    } else {
      setDestination(locName);
      setDestQuery(locName);
      calculateRoute(source, locName);
    }
  };

  return (
    <div className="google-search-panel-container">
      {/* 1. Travel Modes Selector (Car, Bike, Walk, Bicycle, Transit) */}
      <div className="travel-modes-bar">
        <button
          type="button"
          className={`travel-mode-pill ${travelMode === "driving" ? "is-selected" : ""}`}
          onClick={() => {
            setTravelMode("driving");
            calculateRoute(source, destination, "driving");
          }}
          title="Driving (Car)"
        >
          <FaCar />
          <span>Drive</span>
        </button>

        <button
          type="button"
          className={`travel-mode-pill ${travelMode === "motorcycle" ? "is-selected" : ""}`}
          onClick={() => {
            setTravelMode("motorcycle");
            calculateRoute(source, destination, "motorcycle");
          }}
          title="Two-Wheeler (Motorcycle)"
        >
          <FaMotorcycle />
          <span>Moto</span>
        </button>

        <button
          type="button"
          className={`travel-mode-pill ${travelMode === "transit" ? "is-selected" : ""}`}
          onClick={() => {
            setTravelMode("transit");
            calculateRoute(source, destination, "transit");
          }}
          title="Public Transit"
        >
          <FaBus />
          <span>Transit</span>
        </button>

        <button
          type="button"
          className={`travel-mode-pill ${travelMode === "walking" ? "is-selected" : ""}`}
          onClick={() => {
            setTravelMode("walking");
            calculateRoute(source, destination, "walking");
          }}
          title="Walking"
        >
          <FaWalking />
          <span>Walk</span>
        </button>

        <button
          type="button"
          className={`travel-mode-pill ${travelMode === "cycling" ? "is-selected" : ""}`}
          onClick={() => {
            setTravelMode("cycling");
            calculateRoute(source, destination, "cycling");
          }}
          title="Cycling"
        >
          <FaBicycle />
          <span>Cycle</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="directions-input-card">
        {/* Origin Field */}
        <div className="input-row-wrapper">
          <div className="route-node-bullet bullet-origin" title="Starting Point"></div>
          <div className="input-field-core">
            <input
              type="text"
              placeholder="Choose starting point or your location..."
              value={sourceQuery}
              onChange={handleSourceChange}
              onFocus={() => setActiveDropdown("source")}
            />
            {sourceQuery && (
              <button
                type="button"
                className="input-clear-btn"
                onClick={() => {
                  setSourceQuery("");
                  setSource("");
                }}
              >
                <FaTimes />
              </button>
            )}
            <button
              type="button"
              className="input-gps-btn"
              onClick={useCurrentLocation}
              title="Use current GPS location"
            >
              <FaCrosshairs />
            </button>
          </div>

          {/* Autocomplete Dropdown for Origin */}
          {activeDropdown === "source" && sourceSuggestions.length > 0 && (
            <div className="autocomplete-flyout-menu">
              {sourceSuggestions.map((item, idx) => (
                <div
                  key={`src-sug-${idx}`}
                  className="autocomplete-item"
                  onClick={() => handleSelectSource(item)}
                >
                  <FaMapMarkerAlt className="item-icon-marker" />
                  <div className="item-text-group">
                    <strong>{item.name}</strong>
                    <span>{item.displayName}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Swap Origin / Destination Button */}
        <div className="swap-divider-wrapper">
          <div className="dotted-line-connector"></div>
          <button
            type="button"
            className="swap-locations-btn"
            onClick={swapLocations}
            title="Reverse starting point and destination"
          >
            <FaExchangeAlt />
          </button>
        </div>

        {/* Destination Field */}
        <div className="input-row-wrapper">
          <div className="route-node-bullet bullet-dest" title="Destination"></div>
          <div className="input-field-core">
            <input
              type="text"
              placeholder="Choose destination..."
              value={destQuery}
              onChange={handleDestChange}
              onFocus={() => setActiveDropdown("dest")}
            />
            {destQuery && (
              <button
                type="button"
                className="input-clear-btn"
                onClick={() => {
                  setDestQuery("");
                  setDestination("");
                }}
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown for Destination */}
          {activeDropdown === "dest" && destSuggestions.length > 0 && (
            <div className="autocomplete-flyout-menu">
              {destSuggestions.map((item, idx) => (
                <div
                  key={`dst-sug-${idx}`}
                  className="autocomplete-item"
                  onClick={() => handleSelectDest(item)}
                >
                  <FaMapMarkerAlt className="item-icon-marker marker-red" />
                  <div className="item-text-group">
                    <strong>{item.name}</strong>
                    <span>{item.displayName}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preferences & Engine Options Row */}
        <div className="route-options-toolbar">
          <div className="select-dropdown-container">
            <label>Preference:</label>
            <select
              value={routePreference}
              onChange={(e) => {
                setRoutePreference(e.target.value);
                calculateRoute(source, destination);
              }}
            >
              <option value="Fastest Route">⚡ Fastest Route</option>
              <option value="Shortest Route">📏 Shortest Distance</option>
              <option value="Avoid Tolls">🛡️ Avoid Tolls</option>
            </select>
          </div>

          <div className="select-dropdown-container">
            <label>Engine:</label>
            <select
              value={routingEngine}
              onChange={(e) => {
                setRoutingEngine(e.target.value);
                calculateRoute(source, destination);
              }}
            >
              <option value="auto">🌐 Real-time Roads (OSRM)</option>
              <option value="cpp">⚙️ DSA C++ Dijkstra Core</option>
            </select>
          </div>
        </div>

        {/* Quick Location Chips */}
        <div className="quick-presets-track">
          <span className="preset-track-label">Quick:</span>
          <button type="button" onClick={() => handlePresetClick("Patna Junction")}>
            🚉 Station
          </button>
          <button type="button" onClick={() => handlePresetClick("Jay Prakash Narayan Airport Patna")}>
            ✈️ Airport
          </button>
          <button type="button" onClick={() => handlePresetClick("AIIMS Patna")}>
            🏥 AIIMS
          </button>
          <button type="button" onClick={() => handlePresetClick("Amity University Patna")}>
            🎓 Amity
          </button>
          <button type="button" onClick={() => handlePresetClick("Nalanda")}>
            🏛️ Nalanda
          </button>
        </div>

        {/* Main Get Directions Action Button */}
        <button type="submit" className="btn-get-directions" disabled={loading}>
          {loading ? (
            <div className="btn-loading-flex">
              <span className="btn-spinner"></span>
              <span>Finding Best Route...</span>
            </div>
          ) : (
            <div className="btn-content-flex">
              <FaRoute />
              <span>Get Directions</span>
            </div>
          )}
        </button>
      </form>

      {!isRoutePanelOpen && (
        <button
          type="button"
          className="btn-reopen-route-panel"
          onClick={() => setIsRoutePanelOpen(true)}
        >
          <FaRoute />
          <span>Show Route Details ({routeInfo.estimatedTime} &bull; {routeInfo.distance})</span>
        </button>
      )}
    </div>
  );
}

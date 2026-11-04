// src/components/Map/MapView.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  useMapEvents
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigation } from "../../context/NavigationContext";
import NavigationHUD from "../NavigationHUD/NavigationHUD";
import {
  FaPlus,
  FaMinus,
  FaLocationArrow,
  FaCompass,
  FaLayerGroup,
  FaExpand,
  FaCar,
  FaRoute,
  FaStar,
  FaGasPump,
  FaUtensils,
  FaHospital,
  FaHotel,
  FaMoneyBillWave
} from "react-icons/fa";
import "./Map.css";

// Fix Leaflet's default marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

// Custom Google Maps styled SVG DivIcons
const createCustomPin = (color, text) =>
  L.divIcon({
    className: "gmaps-custom-marker",
    html: `
      <div style="
        background: ${color};
        color: #fff;
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid #ffffff;
      ">
        <span style="transform: rotate(45deg); font-size: 13px; font-weight: bold;">${text}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

const startIcon = createCustomPin("#0f9d58", "A"); // Google Green
const destIcon = createCustomPin("#ea4335", "B"); // Google Red

// Car navigation vehicle icon
const createCarIcon = (bearing = 0) =>
  L.divIcon({
    className: "gmaps-car-marker",
    html: `
      <div style="
        transform: rotate(${bearing}deg);
        width: 40px;
        height: 40px;
        background: #1a73e8;
        border: 3px solid #ffffff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px rgba(26,115,232,0.6);
        color: #ffffff;
        font-size: 20px;
        transition: transform 0.4s ease;
      ">
        ▲
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

// Category POI icon
const createPoiIcon = (category) => {
  let color = "#1a73e8";
  let label = "📍";
  const cat = (category || "").toLowerCase();
  if (cat.includes("gas") || cat.includes("fuel")) {
    color = "#f2994a";
    label = "⛽";
  } else if (cat.includes("rest") || cat.includes("food")) {
    color = "#eb5757";
    label = "🍽️";
  } else if (cat.includes("hosp")) {
    color = "#27ae60";
    label = "🏥";
  } else if (cat.includes("hotel")) {
    color = "#9b51e0";
    label = "🏨";
  } else if (cat.includes("atm")) {
    color = "#2d9cdb";
    label = "🏧";
  }

  return L.divIcon({
    className: "gmaps-poi-marker",
    html: `
      <div style="
        background: ${color};
        color: #fff;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        border: 2px solid #fff;
        box-shadow: 0 3px 8px rgba(0,0,0,0.25);
      ">
        ${label}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

// Map events handler: handles clicks to place pins, reverse-geocode & recenters
function MapEventsHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    }
  });
  return null;
}

// Controller to auto fit bounds or center map
function MapBoundsController({ coordinates, isNavigating, navLocation }) {
  const map = useMap();

  useEffect(() => {
    if (isNavigating && navLocation) {
      map.setView(navLocation, 16, { animate: true, duration: 0.8 });
      return;
    }

    if (coordinates && coordinates.length > 1) {
      try {
        const bounds = L.latLngBounds(coordinates);
        map.fitBounds(bounds, {
          padding: [80, 80],
          maxZoom: 15,
          animate: true
        });
      } catch (e) {}
    } else if (coordinates && coordinates.length === 1) {
      map.setView(coordinates[0], 13, { animate: true });
    }
  }, [coordinates, isNavigating, navLocation, map]);

  return null;
}

// Auto invalidates size on mount and window resize so tiles NEVER stay grey
function MapResizeWatcher() {
  const map = useMap();

  useEffect(() => {
    const trigger = () => {
      try {
        map.invalidateSize();
      } catch (e) {}
    };

    trigger();
    const t1 = setTimeout(trigger, 150);
    const t2 = setTimeout(trigger, 500);
    const t3 = setTimeout(trigger, 1200);

    window.addEventListener("resize", trigger);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("resize", trigger);
    };
  }, [map]);

  return null;
}

export default function MapView() {
  const {
    source,
    destination,
    sourceCoords,
    setSourceCoords,
    destinationCoords,
    setDestinationCoords,
    routeCoordinates,
    alternativeRoutes,
    activeRouteIndex,
    selectAlternativeRoute,
    isNavigating,
    navigationProgress,
    mapTheme,
    setMapTheme,
    trafficLayerActive,
    setTrafficLayerActive,
    nearbyPOIs,
    calculateRoute,
    savePlace,
    useCurrentLocation,
    loading
  } = useNavigation();

  const [clickedLocation, setClickedLocation] = useState(null);
  const [showLayerPicker, setShowLayerPicker] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [showZoomHint, setShowZoomHint] = useState(false);
  const hintTimeoutRef = useRef(null);

  // Google Maps Gesture Handling: Disable accidental scroll zooming.
  // Only zoom when user holds Cmd (Mac) or Ctrl (Windows) key while scrolling.
  useEffect(() => {
    if (!mapInstance) return;
    const container = mapInstance.getContainer();

    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        mapInstance.scrollWheelZoom.enable();
      } else {
        mapInstance.scrollWheelZoom.disable();
        setShowZoomHint(true);
        if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
        hintTimeoutRef.current = setTimeout(() => setShowZoomHint(false), 1600);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    };
  }, [mapInstance]);

  const defaultCenter = sourceCoords || [25.6110, 85.1440];

  // Tile layer URLs based on mapTheme
  const tileConfig = useMemo(() => {
    switch (mapTheme) {
      case "satellite":
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution: "Esri Satellite Imagery"
        };
      case "dark":
        return {
          url: "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
          attribution: "&copy; OpenStreetMap contributors &copy; CARTO"
        };
      case "terrain":
        return {
          url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution: "&copy; OpenStreetMap contributors"
        };
      default:
        // Super reliable standard OpenStreetMap tiles (never fails or requires tokens)
        return {
          url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution: "&copy; OpenStreetMap contributors"
        };
    }
  }, [mapTheme]);

  // Handle map click
  const handleMapClick = (latlng) => {
    setClickedLocation({
      lat: latlng.lat,
      lng: latlng.lng,
      name: `Dropped Pin (${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)})`
    });
  };

  // Drag handlers for source & destination pins
  const handleSourceDragEnd = (e) => {
    const newPos = e.target.getLatLng();
    setSourceCoords([newPos.lat, newPos.lng]);
    calculateRoute({ name: `Dropped Start`, lat: newPos.lat, lng: newPos.lng }, destination);
  };

  const handleDestDragEnd = (e) => {
    const newPos = e.target.getLatLng();
    setDestinationCoords([newPos.lat, newPos.lng]);
    calculateRoute(source, { name: `Dropped Destination`, lat: newPos.lat, lng: newPos.lng });
  };

  // Floating button zoom handlers
  const handleZoomIn = () => mapInstance && mapInstance.zoomIn();
  const handleZoomOut = () => mapInstance && mapInstance.zoomOut();
  const handleCompassReset = () => {
    if (mapInstance) {
      mapInstance.setView(sourceCoords || defaultCenter, 13, { animate: true });
    }
  };
  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="google-map-root-wrapper">
      {/* Google Maps gesture notice when scrolling without Cmd/Ctrl */}
      {showZoomHint && (
        <div className="google-maps-gesture-hint">
          Use <strong>⌘ (Cmd) + scroll</strong> to zoom the map
        </div>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
        ref={setMapInstance}
        zoomControl={false}
      >
        <TileLayer url={tileConfig.url} attribution={tileConfig.attribution} />

        {/* Optional Hybrid Labels layer when Satellite mode is selected */}
        {mapTheme === "satellite" && (
          <TileLayer
            url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            opacity={0.8}
          />
        )}

        <MapEventsHandler onMapClick={handleMapClick} />

        <MapBoundsController
          coordinates={routeCoordinates}
          isNavigating={isNavigating}
          navLocation={navigationProgress?.currentLocation}
        />

        <MapResizeWatcher />

        {/* 1. Alternative Route Polylines */}
        {alternativeRoutes &&
          alternativeRoutes.map((alt, index) => (
            <Polyline
              key={`alt-${alt.id || index}`}
              positions={alt.coordinates}
              pathOptions={{
                color: activeRouteIndex === index + 1 ? "#1a73e8" : "#8a9ba8",
                weight: activeRouteIndex === index + 1 ? 6 : 4,
                opacity: 0.65,
                dashArray: activeRouteIndex === index + 1 ? null : "6, 8"
              }}
              eventHandlers={{
                click: () => selectAlternativeRoute(index + 1)
              }}
            >
              <Popup>
                <div style={{ padding: "4px" }}>
                  <strong>{alt.name}</strong>
                  <div>{alt.distance} &bull; {alt.estimatedTime}</div>
                  <button
                    style={{
                      marginTop: "6px",
                      background: "#1a73e8",
                      color: "#fff",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "11px"
                    }}
                    onClick={() => selectAlternativeRoute(index + 1)}
                  >
                    Select this route
                  </button>
                </div>
              </Popup>
            </Polyline>
          ))}

        {/* 2. Primary Route Polyline (Glow outline + bold Google blue) */}
        {routeCoordinates && routeCoordinates.length > 0 && (
          <>
            {/* White outline backdrop for Google Maps road elevation look */}
            <Polyline
              positions={routeCoordinates}
              pathOptions={{
                color: "#ffffff",
                weight: 9,
                opacity: 0.8
              }}
            />
            {/* Core vibrant path */}
            <Polyline
              positions={routeCoordinates}
              pathOptions={{
                color: "#1a73e8",
                weight: 6,
                opacity: 0.95
              }}
            />

            {/* Simulated Live Traffic Color Highlights along road */}
            {trafficLayerActive && routeCoordinates.length > 6 && (
              <Polyline
                positions={routeCoordinates.slice(
                  Math.floor(routeCoordinates.length * 0.35),
                  Math.floor(routeCoordinates.length * 0.55)
                )}
                pathOptions={{
                  color: "#ea4335", // Red heavy traffic delay chunk
                  weight: 7,
                  opacity: 0.9
                }}
              />
            )}
          </>
        )}

        {/* 3. Origin Marker (A) */}
        {sourceCoords && (
          <Marker
            position={sourceCoords}
            icon={startIcon}
            draggable={true}
            eventHandlers={{ dragend: handleSourceDragEnd }}
          >
            <Popup>
              <div className="map-bubble-info">
                <span className="bubble-badge-start">Starting Point (Drag to Move)</span>
                <h4>{source}</h4>
                <p>Lat: {sourceCoords[0].toFixed(4)}, Lng: {sourceCoords[1].toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 4. Destination Marker (B) */}
        {destinationCoords && (
          <Marker
            position={destinationCoords}
            icon={destIcon}
            draggable={true}
            eventHandlers={{ dragend: handleDestDragEnd }}
          >
            <Popup>
              <div className="map-bubble-info">
                <span className="bubble-badge-dest">Destination (Drag to Move)</span>
                <h4>{destination}</h4>
                <p>Lat: {destinationCoords[0].toFixed(4)}, Lng: {destinationCoords[1].toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 5. Live Navigation Vehicle Marker */}
        {isNavigating && navigationProgress?.currentLocation && (
          <Marker
            position={navigationProgress.currentLocation}
            icon={createCarIcon(navigationProgress.bearing)}
            zIndexOffset={1000}
          >
            <Popup>
              <div style={{ textAlign: "center", padding: "4px" }}>
                <strong>Vehicle Navigating</strong>
                <p>{navigationProgress.speed} km/h</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 6. Clicked Pin on Map */}
        {clickedLocation && (
          <Marker position={[clickedLocation.lat, clickedLocation.lng]}>
            <Popup>
              <div className="map-clicked-pin-popup">
                <h4>{clickedLocation.name}</h4>
                <div className="clicked-pin-actions">
                  <button
                    className="pin-action-btn btn-route-from"
                    onClick={() => {
                      setSourceCoords([clickedLocation.lat, clickedLocation.lng]);
                      calculateRoute(
                        { name: "Selected Pin", lat: clickedLocation.lat, lng: clickedLocation.lng },
                        destination
                      );
                      setClickedLocation(null);
                    }}
                  >
                    📍 Directions from here
                  </button>
                  <button
                    className="pin-action-btn btn-route-to"
                    onClick={() => {
                      setDestinationCoords([clickedLocation.lat, clickedLocation.lng]);
                      calculateRoute(source, {
                        name: "Selected Pin",
                        lat: clickedLocation.lat,
                        lng: clickedLocation.lng
                      });
                      setClickedLocation(null);
                    }}
                  >
                    🏁 Directions to here
                  </button>
                  <button
                    className="pin-action-btn btn-save"
                    onClick={() => {
                      savePlace(clickedLocation);
                      setClickedLocation(null);
                    }}
                  >
                    ⭐ Save Place
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 7. Nearby POIs Markers */}
        {nearbyPOIs &&
          nearbyPOIs.map((poi) => (
            <Marker
              key={poi.id}
              position={[poi.lat, poi.lng]}
              icon={createPoiIcon(poi.category)}
            >
              <Popup>
                <div className="map-poi-popup-card">
                  <div className="poi-popup-header">
                    <h4>{poi.name}</h4>
                    <span className="poi-popup-cat">{poi.category}</span>
                  </div>
                  <div className="poi-popup-rating">
                    ⭐ {poi.rating} <span>({poi.reviews || 120} reviews)</span>
                  </div>
                  <p className="poi-popup-addr">{poi.address}</p>
                  <span className="poi-popup-status">{poi.status}</span>
                  <button
                    className="poi-navigate-btn"
                    onClick={() => {
                      calculateRoute(source, { name: poi.name, lat: poi.lat, lng: poi.lng });
                    }}
                  >
                    <FaRoute /> Directions
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* 8. Full In-Car Navigation HUD Overlay when Active */}
      <NavigationHUD />

      {/* 9. Floating Google Maps Controls (Bottom Right) */}
      {!isNavigating && (
        <div className="google-floating-controls">
          <button title="Zoom In" onClick={handleZoomIn} className="floating-ctrl-btn">
            <FaPlus />
          </button>
          <button title="Zoom Out" onClick={handleZoomOut} className="floating-ctrl-btn">
            <FaMinus />
          </button>
          <div className="ctrl-divider"></div>
          <button
            title="My Current Location"
            onClick={useCurrentLocation}
            className="floating-ctrl-btn btn-locate"
          >
            <FaLocationArrow />
          </button>
          <button title="Reset North" onClick={handleCompassReset} className="floating-ctrl-btn">
            <FaCompass />
          </button>
          <button
            title="Map Layers"
            onClick={() => setShowLayerPicker(!showLayerPicker)}
            className={`floating-ctrl-btn ${showLayerPicker ? "ctrl-active" : ""}`}
          >
            <FaLayerGroup />
          </button>
          <button title="Fullscreen" onClick={handleFullscreenToggle} className="floating-ctrl-btn">
            <FaExpand />
          </button>
        </div>
      )}

      {/* 10. Map Layers Switcher Popover Drawer */}
      {showLayerPicker && !isNavigating && (
        <div className="google-layers-picker-card">
          <div className="layers-picker-header">
            <h4>Map Types</h4>
            <button onClick={() => setShowLayerPicker(false)}>✕</button>
          </div>
          <div className="layers-grid">
            <div
              className={`layer-item ${mapTheme === "standard" ? "layer-active" : ""}`}
              onClick={() => setMapTheme("standard")}
            >
              <div className="layer-preview preview-standard">Default</div>
              <span>Street</span>
            </div>
            <div
              className={`layer-item ${mapTheme === "satellite" ? "layer-active" : ""}`}
              onClick={() => setMapTheme("satellite")}
            >
              <div className="layer-preview preview-satellite">Satellite</div>
              <span>Satellite</span>
            </div>
            <div
              className={`layer-item ${mapTheme === "dark" ? "layer-active" : ""}`}
              onClick={() => setMapTheme("dark")}
            >
              <div className="layer-preview preview-dark">Dark</div>
              <span>Night</span>
            </div>
            <div
              className={`layer-item ${mapTheme === "terrain" ? "layer-active" : ""}`}
              onClick={() => setMapTheme("terrain")}
            >
              <div className="layer-preview preview-terrain">Topo</div>
              <span>Terrain</span>
            </div>
          </div>
          <div className="layers-options-row">
            <label className="traffic-toggle-label">
              <input
                type="checkbox"
                checked={trafficLayerActive}
                onChange={(e) => setTrafficLayerActive(e.target.checked)}
              />
              <span>🚦 Live Traffic Layer</span>
            </label>
          </div>
        </div>
      )}

      {/* 11. Loading Route Banner */}
      {loading && (
        <div className="google-route-calculating-chip">
          <div className="spinner-dot"></div>
          <span>Calculating optimal road route...</span>
        </div>
      )}
    </div>
  );
}

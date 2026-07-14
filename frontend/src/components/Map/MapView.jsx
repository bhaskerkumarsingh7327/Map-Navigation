// src/components/Map/MapView.jsx
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet markers fix for Vite setup
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper to update map focus dynamically
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 13, { animate: true });
    }
  }, [position, map]);
  return null;
}

export default function MapView({ routeCoordinates }) {
  // Patna default center setup
  const defaultCenter = [25.611, 85.144]; 
  const startPos = routeCoordinates && routeCoordinates.length > 0 ? routeCoordinates[0] : null;
  const endPos = routeCoordinates && routeCoordinates.length > 0 ? routeCoordinates[routeCoordinates.length - 1] : null;

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px', position: 'relative' }}>
      <MapContainer center={defaultCenter} zoom={13} style={{ width: '100%', height: '100%' }} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Start Position Marker */}
        {startPos && (
          <Marker position={startPos}>
            <Popup>Start Location</Popup>
          </Marker>
        )}

        {/* Destination Position Marker */}
        {endPos && (
          <Marker position={endPos}>
            <Popup>Destination</Popup>
          </Marker>
        )}

        {/* Renders line array from backend DSA algorithm */}
        {routeCoordinates && routeCoordinates.length > 0 && (
          <Polyline 
            positions={routeCoordinates} 
            color="#1a73e8" 
            weight={6} 
            opacity={0.8} 
          />
        )}

        <RecenterMap position={startPos || defaultCenter} />
      </MapContainer>
    </div>
  );
}
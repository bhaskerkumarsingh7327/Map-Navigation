// import "./Map.css";

// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup
// } from "react-leaflet";

// import FloatingControls from "../FloatingControls/FloatingControls";

// function Map() {

//   return (

//     <div className="map-wrapper">

//       <MapContainer

//         center={[28.6139,77.2090]}

//         zoom={13}

//         scrollWheelZoom={true}

//       >

//         <TileLayer

//           attribution="&copy; OpenStreetMap"

//           url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"

//         />

//         <Marker position={[28.6139,77.2090]}>

//           <Popup>

//             Current Location

//           </Popup>

//         </Marker>

//       </MapContainer>

//       <FloatingControls/>

//     </div>

//   );

// }

// export default Map;

import "./Map.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import { useEffect } from "react";

import { useNavigation } from "../../context/NavigationContext";

import FloatingControls from "../FloatingControls/FloatingControls";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function ChangeMapView({ coordinates }) {
  const map = useMap();

  useEffect(() => {
    if (!coordinates || coordinates.length === 0) return;

    if (coordinates.length === 1) {
      map.flyTo(coordinates[0], 14, {
        duration: 1.5,
      });
    } else {
      map.fitBounds(coordinates, {
        padding: [80, 80],
      });
    }
  }, [coordinates, map]);

  return null;
}

function Map() {
  const {
    source,
    destination,
    routeCoordinates,
    loading,
  } = useNavigation();

  const defaultCenter =
    routeCoordinates.length > 0
      ? routeCoordinates[0]
      : [25.611, 85.144];

  return (
    <div className="map-wrapper">

      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "100%",
        }}
      >

        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <ChangeMapView coordinates={routeCoordinates} />

        {routeCoordinates.length > 0 && (
          <>
            <Marker position={routeCoordinates[0]}>
              <Popup>
                <strong>Source</strong>
                <br />
                {source}
              </Popup>
            </Marker>

            <Marker
              position={
                routeCoordinates[
                  routeCoordinates.length - 1
                ]
              }
            >
              <Popup>
                <strong>Destination</strong>
                <br />
                {destination}
              </Popup>
            </Marker>

            <Polyline
              positions={routeCoordinates}
              pathOptions={{
                color: "#1976ff",
                weight: 6,
                opacity: 0.9,
              }}
            />
          </>
        )}

      </MapContainer>

      <FloatingControls />

      {loading && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            padding: "10px 18px",
            borderRadius: "25px",
            fontWeight: "600",
            zIndex: 999,
            boxShadow:
              "0 10px 30px rgba(0,0,0,.15)",
          }}
        >
          Calculating Route...
        </div>
      )}

    </div>
  );
}

export default Map;
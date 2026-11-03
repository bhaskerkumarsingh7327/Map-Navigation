// src/pages/NearbyPage.jsx
import React, { useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import { FaRoute, FaStar, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import "./NearbyPage.css";

export default function NearbyPage({ setActiveTab }) {
  const { calculateRoute, source, nearbyPOIs, searchNearby } = useNavigation();
  const [filterMode, setFilterMode] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filters = ["All", "Gas Stations", "Restaurants", "Hospitals", "Hotels", "ATMs"];

  // Default mock fallback places if none loaded yet
  const defaultItems = [
    { id: 1, name: "Maurya Lok Food Court", category: "Restaurants", rating: 4.6, address: "Dak Bungalow Rd, Patna", status: "Open Now", lat: 25.6175, lng: 85.1380, distance: "1.2 KM" },
    { id: 2, name: "Barbeque Nation Buffet", category: "Restaurants", rating: 4.7, address: "Fraser Road Center, Patna", status: "Open Now", lat: 25.6120, lng: 85.1425, distance: "2.4 KM" },
    { id: 3, name: "Indian Oil Petrol & EV Charging", category: "Gas Stations", rating: 4.4, address: "Station Road Corridor, Patna", status: "24x7 Open", lat: 25.6140, lng: 85.1220, distance: "0.8 KM" },
    { id: 4, name: "HP Auto Fuel & CNG Station", category: "Gas Stations", rating: 4.3, address: "Bailey Road, Patna", status: "24x7 Open", lat: 25.6015, lng: 85.1150, distance: "3.1 KM" },
    { id: 5, name: "AIIMS Patna Apex Emergency", category: "Hospitals", rating: 4.8, address: "Phulwari Sharif, Patna", status: "24x7 Emergency", lat: 25.5601, lng: 85.0450, distance: "5.6 KM" },
    { id: 6, name: "Paras HMRI Healthcare Hospital", category: "Hospitals", rating: 4.6, address: "Bailey Road, Raja Bazar, Patna", status: "24x7 Emergency", lat: 25.6080, lng: 85.0870, distance: "4.2 KM" },
    { id: 7, name: "Hotel Maurya Executive", category: "Hotels", rating: 4.5, address: "South Gandhi Maidan, Patna", status: "Rooms Available", lat: 25.6180, lng: 85.1410, distance: "1.8 KM" },
    { id: 8, name: "State Bank of India 24x7 ATM", category: "ATMs", rating: 4.2, address: "Boring Road Crossing, Patna", status: "Cash Available", lat: 25.6150, lng: 85.1300, distance: "1.0 KM" }
  ];

  const displayList = nearbyPOIs && nearbyPOIs.length > 0 ? nearbyPOIs : defaultItems;

  const filteredItems = displayList.filter(item => {
    const matchesCat = filterMode === "All" || item.category.toLowerCase().includes(filterMode.toLowerCase());
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleNavigateTo = (poi) => {
    calculateRoute(source, { name: poi.name, lat: poi.lat, lng: poi.lng });
    if (setActiveTab) setActiveTab("Home");
  };

  return (
    <div className="dynamic-subpage-view-wrapper fade-blur-entrance">
      <div className="module-intro-meta">
        <h1>Discover Nearby Places of Interest</h1>
        <p>Explore gas stations, restaurants, hospitals, hotels, and ATMs around your current location.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="nearby-controls-bar">
        <div className="nearby-search-field">
          <FaSearch className="nearby-search-icon" />
          <input
            type="text"
            placeholder="Search within nearby places..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="pill-scroll-track">
          {filters.map((f) => (
            <button
              key={f}
              className={`enterprise-filter-pill-node ${filterMode === f ? "pill-is-selected" : ""}`}
              onClick={() => {
                setFilterMode(f);
                searchNearby(f);
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* POI Cards Responsive Grid */}
      <div className="poi-cards-layout-matrix">
        {filteredItems.map((poi) => (
          <div key={poi.id} className="poi-native-card-cell">
            <div className="poi-cell-top-flex">
              <h4>{poi.name}</h4>
              <span className="poi-active-status-tag">{poi.status}</span>
            </div>

            <div className="poi-rating-row">
              <FaStar className="star-yellow" />
              <strong>{poi.rating}</strong>
              <span className="poi-cat-chip">{poi.category}</span>
            </div>

            <p className="poi-address-txt">{poi.address}</p>

            <div className="poi-cell-bottom-flex">
              <span className="poi-distance-badge">
                <FaMapMarkerAlt /> {poi.distance || "Nearby"}
              </span>
              <button
                className="btn-poi-navigate"
                onClick={() => handleNavigateTo(poi)}
              >
                <FaRoute /> Navigate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

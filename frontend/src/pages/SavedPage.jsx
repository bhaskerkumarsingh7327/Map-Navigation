// src/pages/SavedPage.jsx
import React, { useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import { FaBookmark, FaRoute, FaTrash, FaPlus, FaHome, FaBriefcase, FaStar } from "react-icons/fa";
import "./SavedPage.css";

export default function SavedPage({ setActiveTab }) {
  const { savedPlaces, savePlace, removeSavedPlace, calculateRoute, source } = useNavigation();

  const [activeCategory, setActiveCategory] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceAddress, setNewPlaceAddress] = useState("");
  const [newPlaceCategory, setNewPlaceCategory] = useState("Favorites");

  const categories = ["All", "Favorites", "Home", "Work", "Saved Routes"];

  const filteredPlaces = activeCategory === "All"
    ? savedPlaces
    : savedPlaces.filter(p => (p.category || "").toLowerCase() === activeCategory.toLowerCase());

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newPlaceName) return;

    savePlace({
      name: newPlaceName,
      address: newPlaceAddress || newPlaceName,
      category: newPlaceCategory,
      lat: 25.6110 + (Math.random() - 0.5) * 0.05,
      lng: 85.1440 + (Math.random() - 0.5) * 0.05
    });

    setNewPlaceName("");
    setNewPlaceAddress("");
    setShowAddForm(false);
  };

  const handleNavigate = (place) => {
    calculateRoute(source, place);
    if (setActiveTab) setActiveTab("Home");
  };

  const renderCategoryIcon = (cat = "") => {
    switch (cat.toLowerCase()) {
      case "home":
        return <FaHome className="cat-icon cat-home" />;
      case "work":
        return <FaBriefcase className="cat-icon cat-work" />;
      default:
        return <FaStar className="cat-icon cat-star" />;
    }
  };

  return (
    <div className="dynamic-subpage-view-wrapper fade-blur-entrance">
      <div className="saved-page-header-flex">
        <div className="module-intro-meta">
          <h1>Saved Places & Bookmarks</h1>
          <p>Easily access your starred destinations, home, work, and customized routes.</p>
        </div>

        <button
          className="btn-add-place-trigger"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <FaPlus />
          <span>{showAddForm ? "Cancel" : "Add Place"}</span>
        </button>
      </div>

      {/* Add New Place Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="add-place-quick-card">
          <h4>Bookmark New Destination</h4>
          <div className="add-form-inputs-row">
            <input
              type="text"
              placeholder="Place name (e.g., Gym, Central Cafe)..."
              value={newPlaceName}
              onChange={(e) => setNewPlaceName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Address or Landmark..."
              value={newPlaceAddress}
              onChange={(e) => setNewPlaceAddress(e.target.value)}
            />
            <select
              value={newPlaceCategory}
              onChange={(e) => setNewPlaceCategory(e.target.value)}
            >
              <option value="Favorites">⭐ Favorites</option>
              <option value="Home">🏠 Home</option>
              <option value="Work">💼 Work</option>
              <option value="Saved Routes">🗺️ Route</option>
            </select>
            <button type="submit" className="btn-save-submit">Save</button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="saved-category-tabs">
        {categories.map((c) => (
          <button
            key={c}
            className={`saved-tab-pill ${activeCategory === c ? "tab-is-active" : ""}`}
            onClick={() => setActiveCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Bookmarks Grid */}
      <div className="bookmarks-responsive-grid">
        {filteredPlaces.length === 0 ? (
          <div className="empty-saved-state">
            <FaBookmark className="empty-saved-icon" />
            <p>No saved places in this category yet. Click "+ Add Place" above!</p>
          </div>
        ) : (
          filteredPlaces.map((b) => (
            <div key={b.id} className="bookmark-premium-box">
              <div className="bookmark-top-header">
                {renderCategoryIcon(b.category)}
                <div className="bookmark-title-meta">
                  <h3>{b.name}</h3>
                  <span className="bookmark-category-tag">{b.category}</span>
                </div>
                <button
                  className="btn-delete-bookmark"
                  onClick={() => removeSavedPlace(b.id)}
                  title="Remove from saved"
                >
                  <FaTrash />
                </button>
              </div>

              <div className="bookmark-content-card">
                <p className="bookmark-addr">{b.address || b.name}</p>
              </div>

              <button
                className="btn-deploy-vector-action"
                onClick={() => handleNavigate(b)}
              >
                <FaRoute /> Route to This Location
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

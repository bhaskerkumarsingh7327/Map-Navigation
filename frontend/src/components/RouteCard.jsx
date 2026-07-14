import "../styles/RouteCard.css";
import {
  FaRoad,
  FaClock,
  FaTrafficLight,
  FaRoute,
  FaMapMarkerAlt,
} from "react-icons/fa";

function RouteCard() {
  return (
    <div className="route-card">

      <h2>
        <FaRoute /> Route Information
      </h2>

      <div className="route-details">

        <div className="detail-item">
          <span>📏 Distance</span>
          <strong>55 KM</strong>
        </div>

        <div className="detail-item">
          <span><FaClock /> ETA</span>
          <strong>1 Hr 20 Min</strong>
        </div>

        <div className="detail-item">
          <span><FaTrafficLight /> Traffic</span>
          <strong className="medium">Medium</strong>
        </div>

        <div className="detail-item">
          <span><FaRoad /> Road Type</span>
          <strong>Highway</strong>
        </div>

      </div>

      <hr />

      <h3>Route Path</h3>

      <div className="path">

        <p><FaMapMarkerAlt /> Patna</p>
        <div className="line"></div>

        <p><FaMapMarkerAlt /> Nalanda</p>
        <div className="line"></div>

        <p><FaMapMarkerAlt /> Bihar Sharif</p>
        <div className="line"></div>

        <p><FaMapMarkerAlt /> Gaya</p>

      </div>

    </div>
  );
}

export default RouteCard;
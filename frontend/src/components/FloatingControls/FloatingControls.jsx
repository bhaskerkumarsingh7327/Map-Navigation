import "./FloatingControls.css";

import {
  FaPlus,
  FaMinus,
  FaLocationArrow,
  FaCompass,
  FaLayerGroup,
  FaExpand
} from "react-icons/fa";

function FloatingControls() {
  return (
    <div className="floating-controls">

      <button title="Zoom In">
        <FaPlus />
      </button>

      <button title="Zoom Out">
        <FaMinus />
      </button>

      <button title="Current Location">
        <FaLocationArrow />
      </button>

      <button title="Compass">
        <FaCompass />
      </button>

      <button title="Layers">
        <FaLayerGroup />
      </button>

      <button title="Fullscreen">
        <FaExpand />
      </button>

    </div>
  );
}

export default FloatingControls;
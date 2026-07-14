import "./MapControls.css";

import {
  FaPlus,
  FaMinus,
  FaLocationArrow,
  FaCompass,
  FaLayerGroup,
  FaCar
} from "react-icons/fa";

import { useMap } from "react-leaflet";

function MapControls() {

  const map = useMap();

  const zoomIn = () => {
    map.zoomIn();
  };

  const zoomOut = () => {
    map.zoomOut();
  };

  const resetView = () => {
    map.setView([28.6139, 77.2090], 12, {
      animate: true
    });
  };

  const currentLocation = () => {

    navigator.geolocation.getCurrentPosition((position) => {

      map.flyTo(
        [position.coords.latitude, position.coords.longitude],
        15,
        {
          duration: 2
        }
      );

    });

  };

  return (

    <div className="map-controls">

      <button onClick={zoomIn}>
        <FaPlus />
      </button>

      <button onClick={zoomOut}>
        <FaMinus />
      </button>

      <button onClick={currentLocation}>
        <FaLocationArrow />
      </button>

      <button onClick={resetView}>
        <FaCompass />
      </button>

      <button>
        <FaLayerGroup />
      </button>

      <button>
        <FaCar />
      </button>

    </div>

  );

}

export default MapControls;
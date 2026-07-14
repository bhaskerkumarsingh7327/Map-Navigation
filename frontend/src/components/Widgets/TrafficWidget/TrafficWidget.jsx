import "./TrafficWidget.css";

function TrafficWidget() {
  return (
    <div className="traffic-card">

      <div className="traffic-header">
        <h3>Live Traffic</h3>

        <select>

          <option>Now</option>
          <option>1 Hour</option>
          <option>Today</option>

        </select>

      </div>

      <div className="traffic-chart">

        <svg viewBox="0 0 420 90">

          <path
            d="
            M0 60
            C20 20 40 20 60 55
            S100 85 120 40
            S170 25 190 60
            S230 70 260 55
            S300 40 320 60
            S350 30 370 45
            S390 55 420 50
            "
            fill="none"
            stroke="#16a34a"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <path
            d="
            M310 60
            C330 40 350 30 370 45
            S395 60 420 55
            "
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            strokeLinecap="round"
          />

        </svg>

      </div>

      <div className="traffic-status">

        <div>

          <span className="green"></span>

          <h4>Smooth</h4>

          <p>Fast Traffic</p>

        </div>

        <div>

          <span className="orange"></span>

          <h4>Moderate</h4>

          <p>Slow Moving</p>

        </div>

        <div>

          <span className="red"></span>

          <h4>Heavy</h4>

          <p>Traffic Jam</p>

        </div>

      </div>

    </div>
  );
}

export default TrafficWidget;
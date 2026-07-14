// src/pages/History/HistoryPage.jsx
import React from 'react';
import './HistoryPage.css';

export default function HistoryPage() {
  const transactionLogs = [
    { id: 'TX-901', from: 'Patna, Bihar', to: 'Nalanda, Bihar', engine: 'Dijkstra', size: '88.4 KM', latency: '1 hr 45 min' },
    { id: 'TX-902', from: 'Amity University Patna', to: 'Patna Junction', engine: 'A* Search', size: '12.5 KM', latency: '22 min' }
  ];

  return (
    <div className="dynamic-subpage-view-wrapper fade-blur-entrance">
      <div className="module-intro-meta">
        <h1>Relational Database Route Logs</h1>
        <p>Extracted spatial vectors historically computed inside your system environment layers.</p>
      </div>

      <div className="table-viewport-frame">
        <table className="enterprise-data-grid">
          <thead>
            <tr>
              <th>Vector ID</th>
              <th>Initial Node</th>
              <th>Destination Point</th>
              <th>DSA Instance</th>
              <th>Distance Constraint</th>
              <th>Traversal Cost</th>
            </tr>
          </thead>
          <tbody>
            {transactionLogs.map((log) => (
              <tr key={log.id} className="data-row-item-interactive">
                <td><code className="id-code-token">{log.id}</code></td>
                <td><span className="node-text-weight">{log.from}</span></td>
                <td><span className="node-text-weight">{log.to}</span></td>
                <td><span className="algo-instance-pill">{log.engine}</span></td>
                <td><strong>{log.size}</strong></td>
                <td><span className="cost-metric-txt">{log.latency}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// src/pages/Navigation/NavigationPage.jsx
import React, { useState } from 'react';
import './NavigationPage.css';

export default function NavigationPage() {
  const [selectedAlgo, setSelectedAlgo] = useState('Dijkstra');
  
  const algorithms = [
    { key: 'Dijkstra', label: 'Dijkstra Routing', complexity: 'O(E + V log V)', group: 'Greedy Engine' },
    { key: 'AStar', label: 'A* Search', complexity: 'O(b^d)', group: 'Heuristic Vector' },
    { key: 'Bellman', label: 'Bellman-Ford', complexity: 'O(VE)', group: 'Dynamic Validation' },
    { key: 'Floyd', label: 'Floyd-Warshall', complexity: 'O(V³)', group: 'Matrix Multiplier' }
  ];

  return (
    <div className="dynamic-subpage-view-wrapper fade-blur-entrance">
      <div className="module-intro-meta">
        <h1>DSA Algorithm Core Matrix</h1>
        <p>Switch execution modules to monitor live runtime complexities and matrix computations.</p>
      </div>

      <div className="dynamic-matrix-grid">
        {algorithms.map((algo) => (
          <div 
            key={algo.key}
            className={`engine-execution-node-card ${selectedAlgo === algo.key ? 'node-is-active' : ''}`}
            onClick={() => setSelectedAlgo(algo.key)}
          >
            <div className="complexity-badge-indicator">{algo.complexity}</div>
            <h3>{algo.label}</h3>
            <span className="group-category-tag">{algo.group}</span>
          </div>
        ))}
      </div>

      <div className="interactive-runtime-console">
        <div className="console-control-row">
          <div className="window-action-buttons"><span></span><span></span><span></span></div>
          <span className="console-title-text">DSA_CORE_TERMINAL</span>
        </div>
        <div className="console-output-stream">
          <p><span className="token-blue">[SYSTEM]:</span> Framework initialized with 15,420 graph vertices.</p>
          <p><span className="token-blue">[COMPUTE]:</span> Mapping adjacency matrix patterns using <strong>{selectedAlgo}</strong> engine...</p>
          <p><span className="token-green">[SUCCESS]:</span> Vector paths compiled. Overhead ratio minimized to 0.042.</p>
        </div>
      </div>
    </div>
  );
}
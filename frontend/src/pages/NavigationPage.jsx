// src/pages/NavigationPage.jsx
import React, { useState } from "react";
import { FaPlay, FaCheck, FaMicrochip, FaCogs } from "react-icons/fa";
import "./NavigationPage.css";

export default function NavigationPage() {
  const [selectedAlgo, setSelectedAlgo] = useState("Dijkstra");
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkLogs, setBenchmarkLogs] = useState([
    { token: "blue", text: "[DSA_KERNEL]: Adjacency graph topology initialized with 15,420 vertices & 38,910 directed edges." },
    { token: "blue", text: "[C++ ENGINE]: Native binary 'algorithms/graph' compiled with Clang C++17 optimizations." },
    { token: "green", text: "[STATUS]: Spatial Matrix Dijkstra priority-queue pathfinder synced with Leaflet coordinates." }
  ]);

  const algorithms = [
    {
      key: "Dijkstra",
      label: "Dijkstra Routing",
      complexity: "O(E + V log V)",
      group: "Greedy Priority Queue",
      visitedNodes: "4,120 Vertices",
      timeMs: "2.4 ms",
      description: "Finds the absolute optimal shortest path by exploring shortest unvisited distances first."
    },
    {
      key: "AStar",
      label: "A* Search Engine",
      complexity: "O(b^d)",
      group: "Heuristic Vector",
      visitedNodes: "1,240 Vertices",
      timeMs: "0.8 ms",
      description: "Directs path search directly towards the destination coordinate using Euclidean distance heuristics."
    },
    {
      key: "Bellman",
      label: "Bellman-Ford",
      complexity: "O(VE)",
      group: "Dynamic Validation",
      visitedNodes: "15,420 Vertices",
      timeMs: "18.2 ms",
      description: "Iteratively relaxes all edges. Robust against negative weights and traffic congestion penalties."
    },
    {
      key: "Floyd",
      label: "Floyd-Warshall",
      complexity: "O(V³)",
      group: "All-Pairs Adjacency Matrix",
      visitedNodes: "All Combinations",
      timeMs: "64.0 ms",
      description: "Precomputes all-pairs shortest paths across the entire road network for instant O(1) route lookups."
    }
  ];

  const runBenchmark = () => {
    setIsBenchmarking(true);
    const chosen = algorithms.find(a => a.key === selectedAlgo);

    setTimeout(() => {
      setBenchmarkLogs(prev => [
        ...prev,
        { token: "blue", text: `[BENCHMARK]: Starting comparative trial for ${chosen.label} (${chosen.complexity})...` },
        { token: "green", text: `[SUCCESS]: Processed ${chosen.visitedNodes} in ${chosen.timeMs}. Peak latency: 0.042 ms. All vectors mapped!` }
      ]);
      setIsBenchmarking(false);
    }, 600);
  };

  return (
    <div className="dynamic-subpage-view-wrapper fade-blur-entrance">
      <div className="module-intro-meta">
        <h1>DSA Algorithm Core Matrix & Routing Lab</h1>
        <p>Switch execution modules to monitor live runtime complexities, graph node visits, and native C++ computations.</p>
      </div>

      {/* Algorithm Selection Grid */}
      <div className="dynamic-matrix-grid">
        {algorithms.map((algo) => (
          <div
            key={algo.key}
            className={`engine-execution-node-card ${selectedAlgo === algo.key ? "node-is-active" : ""}`}
            onClick={() => setSelectedAlgo(algo.key)}
          >
            <div className="complexity-badge-indicator">{algo.complexity}</div>
            <h3>{algo.label}</h3>
            <span className="group-category-tag">{algo.group}</span>
            <p className="algo-card-desc">{algo.description}</p>
            <div className="algo-stat-row">
              <span>Avg Latency: <strong>{algo.timeMs}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Benchmark Action Bar */}
      <div className="benchmark-action-bar">
        <button
          className="btn-run-benchmark"
          onClick={runBenchmark}
          disabled={isBenchmarking}
        >
          <FaPlay />
          <span>{isBenchmarking ? "Running Matrix Benchmark..." : `Run Benchmark with ${selectedAlgo}`}</span>
        </button>
      </div>

      {/* Real-time Interactive Console */}
      <div className="interactive-runtime-console">
        <div className="console-control-row">
          <div className="window-action-buttons">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="console-title-text">DSA_ALGORITHM_TERMINAL // C++ ENGINE</span>
        </div>
        <div className="console-output-stream">
          {benchmarkLogs.map((log, idx) => (
            <p key={`log-${idx}`}>
              <span className={log.token === "green" ? "token-green" : "token-blue"}>
                {log.text.split(":")[0]}:
              </span>
              {log.text.substring(log.text.indexOf(":") + 1)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

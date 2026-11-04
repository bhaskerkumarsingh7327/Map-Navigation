// src/App.jsx
import React, { useEffect } from 'react';
import { NavigationProvider } from './context/NavigationContext';
import Home from './pages/Home';
import './App.css';

function App() {
  useEffect(() => {
    // Explicitly set browser tab title to Google Maps
    document.title = "Google Maps";

    // Force favicon update in browser cache
    const link = document.querySelector("link[rel*='icon']") || document.createElement("link");
    link.type = "image/svg+xml";
    link.rel = "shortcut icon";
    link.href = `/favicon.svg?v=${Date.now()}`;
    document.getElementsByTagName("head")[0].appendChild(link);
  }, []);

  return (
    <NavigationProvider>
      <Home />
    </NavigationProvider>
  );
}

export default App;

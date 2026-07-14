// import Home from "./pages/Home";

// function App() {
//   return <Home />;
// }

// export default App;
// src/App.jsx
import React from 'react';
import { NavigationProvider } from './context/NavigationContext';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <NavigationProvider>
      <Home />
    </NavigationProvider>
  );
}

export default App;
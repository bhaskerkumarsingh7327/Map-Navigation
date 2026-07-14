// // src/context/NavigationContext.jsx
// import React, { createContext, useState, useContext } from 'react';

// const NavigationContext = createContext();

// export const NavigationProvider = ({ children }) => {
//   const [source, setSource] = useState('Patna, Bihar, India');
//   const [destination, setDestination] = useState('Nalanda, Bihar, India');
//   const [routePreference, setRoutePreference] = useState('Fastest Route');
//   const [routeInfo, setRouteInfo] = useState({
//     distance: '88.4 KM',
//     estimatedTime: '1 hr 45 min',
//     trafficCondition: 'Moderate',
//     roadType: 'Highway',
//   });
//   const [routeCoordinates, setRouteCoordinates] = useState([
//     [25.611, 85.144], // Patna
//     [25.300, 85.300], // Intermediate point
//     [25.135, 85.454], // Nalanda
//   ]);

//   return (
//     <NavigationContext.Provider
//       value={{
//         source,
//         setSource,
//         destination,
//         setDestination,
//         routePreference,
//         setRoutePreference,
//         routeInfo,
//         setRouteInfo,
//         routeCoordinates,
//         setRouteCoordinates,
//       }}
//     >
//       {children}
//     </NavigationContext.Provider>
//   );
// };

// export const useNavigation = () => useContext(NavigationContext);
// src/context/NavigationContext.jsx

import React, { createContext, useState, useContext } from "react";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  // Existing States
  const [source, setSource] = useState("Patna, Bihar, India");

  const [destination, setDestination] = useState("Nalanda, Bihar, India");

  const [routePreference, setRoutePreference] =
    useState("Fastest Route");

  const [routeInfo, setRouteInfo] = useState({
    distance: "88.4 KM",
    estimatedTime: "1 hr 45 min",
    trafficCondition: "Moderate",
    roadType: "Highway",
  });

  const [routeCoordinates, setRouteCoordinates] = useState([
    [25.611, 85.144],
    [25.300, 85.300],
    [25.135, 85.454],
  ]);

  // -------------------------------
  // Backend Integration States
  // -------------------------------

  const [routeData, setRouteData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  return (
    <NavigationContext.Provider
      value={{
        // Existing
        source,
        setSource,

        destination,
        setDestination,

        routePreference,
        setRoutePreference,

        routeInfo,
        setRouteInfo,

        routeCoordinates,
        setRouteCoordinates,

        // Backend
        routeData,
        setRouteData,

        loading,
        setLoading,

        error,
        setError,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
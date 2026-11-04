// src/context/NavigationContext.jsx
import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import {
  getShortestPath,
  searchLocation,
  reverseGeocode,
  getNearbyPlaces,
  PREDEFINED_LOCATIONS
} from "../services/api";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  // 1. Core Source & Destination States
  const [source, setSource] = useState("Patna, Bihar, India");
  const [sourceCoords, setSourceCoords] = useState([25.6110, 85.1440]);
  const [destination, setDestination] = useState("Nalanda, Bihar, India");
  const [destinationCoords, setDestinationCoords] = useState([25.1350, 85.4540]);

  // 2. Travel & Route Options
  const [travelMode, setTravelMode] = useState("driving"); // driving, motorcycle, walking, cycling, transit
  const [routePreference, setRoutePreference] = useState("Fastest Route");
  const [routingEngine, setRoutingEngine] = useState("auto"); // auto, osrm, cpp

  // 3. Calculated Route States
  const [routeInfo, setRouteInfo] = useState({
    distance: "88.4 KM",
    distanceValue: 88.4,
    estimatedTime: "1 hr 45 min",
    travelTimeMinutes: 105,
    arrivalTime: "11:45 PM",
    trafficCondition: "Moderate Traffic",
    roadType: "National Highway NH 31",
    fuelEstimate: "≈ 6.2 L",
    tollCount: "1 Toll Road"
  });

  const [routeCoordinates, setRouteCoordinates] = useState([
    [25.6110, 85.1440],
    [25.4800, 85.2200],
    [25.3200, 85.3400],
    [25.1350, 85.4540]
  ]);

  const [steps, setSteps] = useState([
    {
      id: 0,
      instruction: "Head east on Bailey Road / NH 30",
      streetName: "Bailey Road",
      distance: "2.4 km",
      duration: "6 min",
      type: "depart",
      icon: "start"
    },
    {
      id: 1,
      instruction: "Turn right onto NH 31 Highway Corridor",
      streetName: "NH 31",
      distance: "62.0 km",
      duration: "1 hr 12 min",
      type: "turn",
      icon: "right"
    },
    {
      id: 2,
      instruction: "Continue straight past Bakhtiyarpur Junction",
      streetName: "NH 31 Express",
      distance: "18.0 km",
      duration: "20 min",
      type: "continue",
      icon: "straight"
    },
    {
      id: 3,
      instruction: "Arrive at Nalanda Historical Site",
      streetName: "Nalanda Heritage Road",
      distance: "6.0 km",
      duration: "7 min",
      type: "arrive",
      icon: "finish"
    }
  ]);

  const [alternativeRoutes, setAlternativeRoutes] = useState([]);
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(true);
  const [isRoutePanelOpen, setIsRoutePanelOpen] = useState(true);

  // 4. Live GPS Turn-by-Turn Navigation States (Real Device GPS & Demo Simulation)
  const [isNavigating, setIsNavigating] = useState(false);
  const [navMode, setNavMode] = useState("live"); // 'live' = Real Physical GPS Driving, 'demo' = Virtual Simulation
  const [isNavPaused, setIsNavPaused] = useState(false);
  const [navSpeedMultiplier, setNavSpeedMultiplier] = useState(1); // 1x, 2x, 4x
  const isNavPausedRef = useRef(false);
  const navSpeedMultiplierRef = useRef(1);
  const watchIdRef = useRef(null);

  const [navigationProgress, setNavigationProgress] = useState({
    currentStepIndex: 0,
    currentCoordIndex: 0,
    speed: 0,
    remainingDistance: "88.4 KM",
    remainingTime: "1 hr 45 min",
    currentLocation: [25.6110, 85.1440],
    bearing: 90,
    nextManeuver: "Head east on Bailey Road"
  });
  const [isMuted, setIsMuted] = useState(false);
  const navigationTimerRef = useRef(null);

  useEffect(() => {
    isNavPausedRef.current = isNavPaused;
  }, [isNavPaused]);

  useEffect(() => {
    navSpeedMultiplierRef.current = navSpeedMultiplier;
  }, [navSpeedMultiplier]);

  // 5. Map Styling & UI Options
  const [mapTheme, setMapTheme] = useState("standard"); // standard, satellite, dark, terrain
  const [trafficLayerActive, setTrafficLayerActive] = useState(true);
  const [mapCenter, setMapCenter] = useState([25.6110, 85.1440]);
  const [mapZoom, setMapZoom] = useState(11);

  // 6. Nearby POIs
  const [nearbyPOIs, setNearbyPOIs] = useState([]);
  const [activeNearbyCategory, setActiveNearbyCategory] = useState("All");

  // 7. Persistent User Data (LocalStorage)
  const [savedPlaces, setSavedPlaces] = useState(() => {
    try {
      const stored = localStorage.getItem("gmaps_saved_places");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      { id: 1, name: "Home (Patna)", category: "Home", address: "Boring Road, Patna, Bihar", lat: 25.6172, lng: 85.1189 },
      { id: 2, name: "Amity Campus", category: "Work", address: "Bailey Road Extension, Patna", lat: 25.5892, lng: 85.0592 },
      { id: 3, name: "Nalanda Ancient Ruins", category: "Favorites", address: "Nalanda Heritage Area, Bihar", lat: 25.1350, lng: 85.4540 }
    ];
  });

  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem("gmaps_history");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: "tx-1",
        from: "Patna, Bihar",
        to: "Nalanda, Bihar",
        distance: "88.4 KM",
        duration: "1 hr 45 min",
        mode: "driving",
        date: "Today, 10:30 AM"
      },
      {
        id: "tx-2",
        from: "Patna Junction",
        to: "AIIMS Patna",
        distance: "14.2 KM",
        duration: "32 min",
        mode: "driving",
        date: "Yesterday, 4:15 PM"
      }
    ];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save to LocalStorage on updates
  useEffect(() => {
    try {
      localStorage.setItem("gmaps_saved_places", JSON.stringify(savedPlaces));
    } catch (e) {}
  }, [savedPlaces]);

  useEffect(() => {
    try {
      localStorage.setItem("gmaps_history", JSON.stringify(history));
    } catch (e) {}
  }, [history]);

  // Initial calculation & POIs load on application startup
  useEffect(() => {
    calculateRoute("Patna, Bihar, India", "Nalanda, Bihar, India");
    searchNearby("All");
  }, []);

  // Voice speech synthesis helper
  const speakInstruction = (text) => {
    if (isMuted || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  };

  // Main Route Calculation
  const calculateRoute = async (srcInput = source, dstInput = destination, mode = travelMode) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getShortestPath(srcInput, dstInput, {
        mode,
        preference: routePreference,
        engine: routingEngine
      });

      if (result.success && result.data) {
        const {
          distance,
          estimatedTime,
          arrivalTime,
          trafficCondition,
          roadType,
          coordinates,
          steps: routeSteps,
          alternativeRoutes: alts,
          fuelEstimate,
          tollCount
        } = result.data;

        setRouteInfo({
          distance: distance || "88.4 KM",
          estimatedTime: estimatedTime || "1 hr 45 min",
          arrivalTime: arrivalTime || "Arrive by 11:45 PM",
          trafficCondition: trafficCondition || "Normal",
          roadType: roadType || "Highway",
          fuelEstimate: fuelEstimate || "≈ 5.8 L",
          tollCount: tollCount || "1 Toll"
        });

        if (coordinates && coordinates.length > 0) {
          setRouteCoordinates(coordinates);
          setSourceCoords(coordinates[0]);
          setDestinationCoords(coordinates[coordinates.length - 1]);
          setMapCenter(coordinates[0]);
        }

        if (routeSteps && routeSteps.length > 0) {
          setSteps(routeSteps);
        }

        setAlternativeRoutes(alts || []);
        setActiveRouteIndex(0);

        // Add to history
        const newHistoryItem = {
          id: `tx-${Date.now()}`,
          from: typeof srcInput === "string" ? srcInput : srcInput.name,
          to: typeof dstInput === "string" ? dstInput : dstInput.name,
          distance: distance || "88 KM",
          duration: estimatedTime || "1 hr 45 min",
          mode,
          date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + ", Today"
        };
        setHistory(prev => [newHistoryItem, ...prev.slice(0, 19)]);
      } else {
        setError("Unable to calculate route. Using default path.");
      }
    } catch (err) {
      console.error("Routing error:", err);
      setError("Routing service unavailable.");
    } finally {
      setLoading(false);
    }
  };

  // Switch between primary and alternative routes
  const selectAlternativeRoute = (index) => {
    if (index === 0) {
      setActiveRouteIndex(0);
      return;
    }
    const alt = alternativeRoutes[index - 1];
    if (alt) {
      setActiveRouteIndex(index);
      setRouteCoordinates(alt.coordinates);
      setRouteInfo(prev => ({
        ...prev,
        distance: alt.distance,
        estimatedTime: alt.estimatedTime
      }));
    }
  };

  // Swap Origin and Destination
  const swapLocations = () => {
    const tempSrc = source;
    const tempSrcCoords = sourceCoords;
    setSource(destination);
    setSourceCoords(destinationCoords);
    setDestination(tempSrc);
    setDestinationCoords(tempSrcCoords);
    calculateRoute(destination, tempSrc);
  };

  // Use HTML5 Geolocation to set current user location
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const rev = await reverseGeocode(latitude, longitude);
        setSource(rev.displayName || `My Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        setSourceCoords([latitude, longitude]);
        setMapCenter([latitude, longitude]);
        setMapZoom(14);
        setLoading(false);
        calculateRoute({ name: rev.name, lat: latitude, lng: longitude }, destination);
      },
      (err) => {
        console.warn("Geolocation error, fallback to default Patna location:", err.message);
        setSource("Patna Junction, Bihar");
        setSourceCoords([25.6025, 85.1376]);
        setLoading(false);
      },
      { timeout: 8000 }
    );
  };

  // Helper to interpolate dense micro-steps so vehicle moves smoothly without jumping
  const interpolateDensePath = (coords, stepMeters = 20) => {
    if (!coords || coords.length < 2) return coords || [];
    const finePoints = [];

    for (let i = 0; i < coords.length - 1; i++) {
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const dLat = (p2[0] - p1[0]) * 111320;
      const dLng = (p2[1] - p1[1]) * 111320 * Math.cos((p1[0] * Math.PI) / 180);
      const distMeters = Math.hypot(dLat, dLng);
      const stepsCount = Math.max(1, Math.ceil(distMeters / stepMeters));

      for (let s = 0; s < stepsCount; s++) {
        const t = s / stepsCount;
        finePoints.push([
          p1[0] + (p2[0] - p1[0]) * t,
          p1[1] + (p2[1] - p1[1]) * t
        ]);
      }
    }
    finePoints.push(coords[coords.length - 1]);
    return finePoints;
  };

  // Toggle Pause/Resume during navigation
  const togglePauseNavigation = () => {
    setIsNavPaused(prev => !prev);
  };

  // Cycle simulation speed (1x -> 2x -> 4x -> 1x)
  const cycleNavSpeed = () => {
    setNavSpeedMultiplier(prev => {
      if (prev === 1) return 2;
      if (prev === 2) return 4;
      return 1;
    });
  };

  // Start Navigation: Supports 'live' (Real Device GPS Movement) and 'demo' (Virtual Simulation Drive)
  const startNavigation = (chosenMode = navMode) => {
    if (!routeCoordinates || routeCoordinates.length === 0) return;

    // Reset previous timers / GPS watches
    if (navigationTimerRef.current) clearInterval(navigationTimerRef.current);
    if (watchIdRef.current && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setIsNavigating(true);
    setIsNavPaused(false);
    isNavPausedRef.current = false;
    setNavMode(chosenMode);

    const firstStepText = steps.length > 0 ? steps[0].instruction : "Proceed along highlighted route";
    speakInstruction(`Starting navigation to ${destination}. ${firstStepText}`);

    // ========================================================
    // 1. REAL PHYSICAL GPS MODE (Jab Aap Asli Gaadi Me Honge)
    // ========================================================
    if (chosenMode === "live") {
      // In Live GPS Mode: Gaadi apne aap bilkul NAHI chalegi!
      // Jab tak aapki physical car/phone nahi chalegi, speed = 0 km/h rahegi aur gaadi wahi ruki rahegi!
      const initialPos = sourceCoords || routeCoordinates[0];

      setNavigationProgress({
        currentStepIndex: 0,
        currentCoordIndex: 0,
        speed: 0, // Parked / Stopped initially
        remainingDistance: routeInfo.distance || "88 KM",
        remainingTime: routeInfo.estimatedTime || "1 hr 45 min",
        currentLocation: initialPos,
        bearing: 0,
        nextManeuver: steps[0]?.instruction || "Head towards route"
      });

      if (navigator.geolocation) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude, longitude, speed: rawSpeed, heading } = pos.coords;
            const currentPos = [latitude, longitude];

            // Real physical GPS speed in km/h (0 when vehicle is stopped!)
            const realSpeed = (rawSpeed !== null && rawSpeed > 0) ? Math.round(rawSpeed * 3.6) : 0;

            // Real distance to destination
            const destCoord = destinationCoords || routeCoordinates[routeCoordinates.length - 1];
            const distToDestKm = calculateEuclideanDistance(currentPos, destCoord).toFixed(1);

            // Time estimate based on real speed
            const speedToUse = realSpeed > 5 ? realSpeed : 35;
            const minsLeft = Math.max(1, Math.round((parseFloat(distToDestKm) / speedToUse) * 60));
            const hours = Math.floor(minsLeft / 60);
            const mins = minsLeft % 60;
            const remainingTimeStr = hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`;

            // Detect closest step
            let closestStep = steps[0];
            let minStepDist = Infinity;
            steps.forEach((step) => {
              if (step.location) {
                const d = calculateEuclideanDistance(currentPos, step.location);
                if (d < minStepDist) {
                  minStepDist = d;
                  closestStep = step;
                }
              }
            });

            // Voice guidance when approaching turn within 200m
            if (minStepDist < 0.2 && closestStep) {
              speakInstruction(`In 200 meters, ${closestStep.instruction}`);
            }

            // Destination reached check (within 50 meters)
            if (parseFloat(distToDestKm) < 0.05) {
              speakInstruction("You have arrived at your destination.");
              stopNavigation();
              return;
            }

            setNavigationProgress({
              currentStepIndex: closestStep?.id || 0,
              currentCoordIndex: 0,
              speed: realSpeed, // 0 km/h when stopped at red light!
              remainingDistance: `${distToDestKm} KM`,
              remainingTime: remainingTimeStr,
              currentLocation: currentPos,
              bearing: heading || 0,
              nextManeuver: closestStep?.instruction || "Continue on route"
            });
          },
          (err) => {
            console.warn("Live GPS watchPosition error:", err.message);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 1000,
            timeout: 10000
          }
        );
      }
      return;
    }

    // ========================================================
    // 2. DEMO / SIMULATION MODE (Ghar Baithe Route Preview Dekhne Ke Liye)
    // ========================================================
    const densePath = interpolateDensePath(routeCoordinates, 20);
    let coordIdx = 0;
    let stepIdx = 0;
    let currentSpeed = 0;
    const cruiseSpeed = 38;

    setNavigationProgress({
      currentStepIndex: 0,
      currentCoordIndex: 0,
      speed: 0,
      remainingDistance: routeInfo.distance || "88 KM",
      remainingTime: routeInfo.estimatedTime || "1 hr 45 min",
      currentLocation: densePath[0],
      bearing: 90,
      nextManeuver: steps[0]?.instruction || "Head ahead"
    });

    navigationTimerRef.current = setInterval(() => {
      if (isNavPausedRef.current) {
        setNavigationProgress(prev => ({ ...prev, speed: 0 }));
        return;
      }

      const multiplier = navSpeedMultiplierRef.current || 1;
      coordIdx += multiplier;

      if (coordIdx >= densePath.length) {
        clearInterval(navigationTimerRef.current);
        speakInstruction("You have reached your destination.");
        setIsNavigating(false);
        setIsNavPaused(false);
        return;
      }

      const currentPos = densePath[coordIdx];
      const prevPos = densePath[Math.max(0, coordIdx - 1)];

      const dLon = (currentPos[1] - prevPos[1]) * (Math.PI / 180);
      const lat1 = prevPos[0] * (Math.PI / 180);
      const lat2 = currentPos[0] * (Math.PI / 180);
      const y = Math.sin(dLon) * Math.cos(lat2);
      const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
      const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;

      if (currentSpeed < cruiseSpeed) {
        currentSpeed = Math.min(cruiseSpeed, currentSpeed + 3);
      } else {
        currentSpeed = cruiseSpeed + Math.sin(coordIdx * 0.1) * 2;
      }

      const fraction = coordIdx / densePath.length;
      const totalKm = routeInfo.distanceValue || 88;
      const remainingKm = Math.max(0, (totalKm * (1 - fraction))).toFixed(1);
      const totalMins = routeInfo.travelTimeMinutes || 105;
      const remainingMins = Math.max(1, Math.round(totalMins * (1 - fraction)));
      const hours = Math.floor(remainingMins / 60);
      const mins = remainingMins % 60;
      const remainingTime = hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`;

      const targetStepIdx = Math.min(
        steps.length - 1,
        Math.floor(fraction * steps.length)
      );
      if (targetStepIdx !== stepIdx) {
        stepIdx = targetStepIdx;
        if (steps[stepIdx]) {
          speakInstruction(`In 200 meters, ${steps[stepIdx].instruction}`);
        }
      }

      setNavigationProgress({
        currentStepIndex: stepIdx,
        currentCoordIndex: coordIdx,
        speed: Math.round(currentSpeed * multiplier),
        remainingDistance: `${remainingKm} KM`,
        remainingTime,
        currentLocation: currentPos,
        bearing,
        nextManeuver: steps[stepIdx] ? steps[stepIdx].instruction : "Continue on route"
      });
    }, 280);
  };

  const stopNavigation = () => {
    if (navigationTimerRef.current) clearInterval(navigationTimerRef.current);
    if (watchIdRef.current && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsNavigating(false);
    setIsNavPaused(false);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  // Nearby Places
  const searchNearby = async (category = "All") => {
    setActiveNearbyCategory(category);
    const center = sourceCoords || [25.6110, 85.1440];
    const results = await getNearbyPlaces(category, center);
    setNearbyPOIs(results);
  };

  // Saved Places methods
  const savePlace = (place) => {
    const newItem = {
      id: Date.now(),
      name: place.name || "Custom Saved Location",
      category: place.category || "Favorites",
      address: place.address || place.displayName || `${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}`,
      lat: place.lat,
      lng: place.lng
    };
    setSavedPlaces(prev => [newItem, ...prev]);
  };

  const removeSavedPlace = (id) => {
    setSavedPlaces(prev => prev.filter(p => p.id !== id));
  };

  // Clear History
  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("gmaps_history");
    } catch (e) {}
  };

  return (
    <NavigationContext.Provider
      value={{
        source,
        setSource,
        sourceCoords,
        setSourceCoords,
        destination,
        setDestination,
        destinationCoords,
        setDestinationCoords,
        travelMode,
        setTravelMode,
        routePreference,
        setRoutePreference,
        routingEngine,
        setRoutingEngine,
        routeInfo,
        setRouteInfo,
        routeCoordinates,
        setRouteCoordinates,
        steps,
        setSteps,
        alternativeRoutes,
        activeRouteIndex,
        selectAlternativeRoute,
        isNavigating,
        navMode,
        setNavMode,
        isNavPaused,
        togglePauseNavigation,
        navSpeedMultiplier,
        cycleNavSpeed,
        navigationProgress,
        startNavigation,
        stopNavigation,
        isMuted,
        setIsMuted,
        mapTheme,
        setMapTheme,
        trafficLayerActive,
        setTrafficLayerActive,
        mapCenter,
        setMapCenter,
        mapZoom,
        setMapZoom,
        nearbyPOIs,
        activeNearbyCategory,
        searchNearby,
        savedPlaces,
        savePlace,
        removeSavedPlace,
        history,
        clearHistory,
        calculateRoute,
        swapLocations,
        useCurrentLocation,
        isDirectionsOpen,
        setIsDirectionsOpen,
        isRoutePanelOpen,
        setIsRoutePanelOpen,
        loading,
        error
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);

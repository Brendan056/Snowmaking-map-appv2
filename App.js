import React, { useState, useEffect } from "react";
import { MapContainer, ImageOverlay, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const ICONS = {
  snowGun: new L.Icon({
    iconUrl: "https://img.icons8.com/ios-filled/50/snow.png",
    iconSize: [24, 24],
  }),
  hydrant: new L.Icon({
    iconUrl: "https://img.icons8.com/ios-filled/50/fire-hydrant.png",
    iconSize: [24, 24],
  }),
  valve: new L.Icon({
    iconUrl: "https://img.icons8.com/ios-filled/50/valve.png",
    iconSize: [24, 24],
  }),
  outlet: new L.Icon({
    iconUrl: "https://img.icons8.com/ios-filled/50/electrical.png",
    iconSize: [24, 24],
  }),
  gps: new L.Icon({
    iconUrl: "https://img.icons8.com/ios-filled/50/gps-device.png",
    iconSize: [20, 20],
  }),
};

const COMPONENTS = [
  { id: "101", type: "snowGun", position: [50, 50] },
  { id: "102", type: "hydrant", position: [60, 60] },
  { id: "103", type: "valve", position: [70, 40] },
  { id: "104", type: "outlet", position: [80, 30] },
];

function convertGPSToMapCoords(lat, lng) {
  const latMin = 51.095;
  const latMax = 51.100;
  const lngMin = -113.576;
  const lngMax = -113.570;

  const x = ((lng - lngMin) / (lngMax - lngMin)) * 100;
  const y = ((latMax - lat) / (latMax - latMin)) * 100;

  return [y, x];
}

function GPSMarker({ onPlaceMarker }) {
  const [gpsCoords, setGpsCoords] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const mapCoords = convertGPSToMapCoords(latitude, longitude);
        setGpsCoords(mapCoords);
      });
    }
  }, []);

  if (!gpsCoords) return null;

  return (
    <>
      <Marker position={gpsCoords} icon={ICONS.gps}>
        <Popup>
          You are here. <br />
          <button onClick={() => onPlaceMarker(gpsCoords)}>Place Snow Gun</button>
        </Popup>
      </Marker>
    </>
  );
}

export default function App() {
  const [items, setItems] = useState(COMPONENTS);

  const handlePlaceMarker = (position) => {
    const newItem = {
      id: `gps-${Date.now()}`,
      type: "snowGun",
      position,
    };
    setItems([...items, newItem]);
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <MapContainer
        center={[50, 50]}
        zoom={2}
        crs={L.CRS.Simple}
        style={{ height: "100%", width: "100%" }}
        maxBounds={[[0, 0], [100, 100]]}
      >
        <ImageOverlay
          url="/canyon-map.jpg"
          bounds={[[0, 0], [100, 100]]}
        />

        {items.map((item) => (
          <Marker
            key={item.id}
            position={item.position}
            icon={ICONS[item.type]}
          >
            <Popup>
              <strong>{item.type}</strong> — ID: {item.id}
            </Popup>
          </Marker>
        ))}

        <GPSMarker onPlaceMarker={handlePlaceMarker} />
      </MapContainer>
    </div>
  );
}

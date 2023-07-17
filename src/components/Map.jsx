import {
  Marker,
  Popup,
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlParams } from "../hooks/useUrlParams";

import Button from "./Button";

const flagemojiToPNG = (flag) => {
  if (!flag) return "";
  var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
    .map((char) => String.fromCharCode(char - 127397).toLowerCase())
    .join("");
  return (
    <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />
  );
};

function Map() {
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const { cities } = useCities();
  const {
    isLoading: geoPositionLoading,
    position: GeoPosition,
    getPosition,
  } = useGeolocation();

  const [lat, lng] = useUrlParams();

  useEffect(() => {
    if (lat && lng) setMapPosition([lat, lng]);
  }, [lat, lng]);

  useEffect(() => {
    if (GeoPosition) setMapPosition([GeoPosition.lat, GeoPosition.lng]);
  }, [GeoPosition]);
  return (
    <div className={styles.mapContainer}>
      {!GeoPosition && (
        <Button type="position" onClick={getPosition}>
          {geoPositionLoading ? "Loading..." : "Use Your Position"}
        </Button>
      )}
      <MapContainer
        className={styles.map}
        center={mapPosition}
        // center={[lat, lng]}
        zoom={6}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => {
          return (
            <Marker
              position={[city.position.lat, city.position.lng]}
              key={city.id}
            >
              <Popup>
                <span>{city.cityName}</span>
                <span>{flagemojiToPNG(city.emoji)}</span>
              </Popup>
            </Marker>
          );
        })}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}
export default Map;

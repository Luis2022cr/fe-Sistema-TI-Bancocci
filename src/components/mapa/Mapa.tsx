import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';

const onlineIcon = L.icon({
  iconUrl: '/src/assets/pingtrue.svg', // Debes proporcionar la ruta del ícono que deseas usar
  iconSize: [40, 45], // Tamaño del ícono
  iconAnchor: [12, 41], // Punto donde se ancla el ícono
  popupAnchor: [1, -34], // Punto donde se mostrará el popup
});

const offlineIcon = L.icon({
  iconUrl: '/src/assets/pingFalse.svg',
  iconSize: [40, 45],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MapaCopan: React.FC = () => {
  // Datos de prueba para las ubicaciones de las agencias, incluyendo un estado simulado (online/offline)
  const locations = [
    { nombre: "Agencia Central Santa Rosa", ciudad: "Santa Rosa de Copán", lat: 14.768094612693012, lon: -88.77821754326601, status: "online" },
    { nombre: "Agencia Santa Rosa Norte", ciudad: "Santa Rosa de Copán", lat: 15.248345568812995, lon: -88.556792028836, status: "offline" },
    { nombre: "Agencia Santa Rosa Sur", ciudad: "Santa Rosa de Copán", lat: 14.7600, lon: -88.7850, status: "offline" },
    { nombre: "Agencia La Entrada", ciudad: "La Entrada", lat: 15.0500, lon: -88.7800, status: "offline" },
    { nombre: "Agencia Copán Ruinas", ciudad: "Copán Ruinas", lat: 14.8400, lon: -89.1500, status: "online" },
    { nombre: "Agencia Cucuyagua", ciudad: "Cucuyagua", lat: 14.154806096331692, lon: -88.03693469874588, status: "offline" },
    { nombre: "Agencia La Florida", ciudad: "La Florida", lat: 14.8200, lon: -88.9300, status: "online" },
  ];
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold text-center mt-11 ">Mapa UPS Zona Occidente, Honduras</h1>
      <div className="container p-4 mt-5 ">
        <MapContainer
          center={[14.7667, -88.7794]} // Coordenadas para centrar el mapa en Santa Rosa de Copán
          zoom={8.5}
          style={{ height: '500px', width: '100%' }} // Tamaño del mapa
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Marcadores con estado online/offline */}
          {locations.map((location, index) => (
            <Marker
              key={index}
              position={[location.lat, location.lon]}
              icon={location.status === 'online' ? onlineIcon : offlineIcon} // Usamos los íconos personalizados

            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-semibold">{location.nombre}</h3>
                  <p>{location.ciudad}</p>
                  <p>Status: <strong className={location.status === 'online' ? 'text-green-600' : 'text-red-600'}>{location.status}</strong></p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
};

export default MapaCopan;

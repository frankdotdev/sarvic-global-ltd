'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Office {
  city: string;
  country: string;
  lat: number;
  lng: number;
  role: string;
}

export default function WorldMap({ offices }: { offices: Office[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="aspect-[16/9] md:aspect-[2/1] bg-paper border border-rule" />;
  }

  const center: [number, number] = [20, 50];

  // Connect routes between offices to illustrate trade corridors
  const routes: [[number, number], [number, number]][] = [
    [[offices[0].lat, offices[0].lng], [offices[1].lat, offices[1].lng]], // Guangzhou - Istanbul
    [[offices[0].lat, offices[0].lng], [offices[2].lat, offices[2].lng]], // Guangzhou - Lagos
    [[offices[1].lat, offices[1].lng], [offices[2].lat, offices[2].lng]], // Istanbul - Lagos
  ];

  return (
    <div className="aspect-[16/9] md:aspect-[2/1] border border-rule overflow-hidden relative">
      <MapContainer
        center={center}
        zoom={2}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', background: '#F7F5F0' }}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors'
        />

        {routes.map((route, idx) => (
          <Polyline
            key={idx}
            positions={route}
            pathOptions={{ color: '#C8A96E', weight: 1.5, opacity: 0.6, dashArray: '4 6' }}
          />
        ))}

        {offices.map((office) => (
          <CircleMarker
            key={office.city}
            center={[office.lat, office.lng]}
            radius={8}
            pathOptions={{
              fillColor: '#0F1F38',
              fillOpacity: 1,
              color: '#C8A96E',
              weight: 2,
            }}
          >
            <Popup>
              <div style={{ fontFamily: 'DM Sans, sans-serif', minWidth: 160 }}>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, margin: 0, color: '#0D0D0D' }}>
                  {office.city}, {office.country}
                </p>
                <p style={{ fontSize: 11, color: '#8A8A8A', margin: '4px 0 0', letterSpacing: '0.05em' }}>
                  {office.role}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

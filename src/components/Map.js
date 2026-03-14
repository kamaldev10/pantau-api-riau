"use client";
import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import HeatmapLayer from "./HeatmapLayer";

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 12, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function Map({ hotspots, mapCenter, zoomLevel, showHeatmap }) {
  if (typeof window === "undefined") return null;

  const RIAU_DEFAULT = [0.5071, 101.4478];

  return (
    <div className="relative w-full h-100 md:h-137.5">
      <MapContainer
        center={RIAU_DEFAULT}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* 1. Tambahkan Heatmap Layer di sini */}
        <HeatmapLayer hotspots={hotspots} />
        <MapController center={mapCenter} zoom={zoomLevel} />
        {showHeatmap ? (
          // Jika Heatmap AKTIF: Tampilkan layer panas saja
          <HeatmapLayer hotspots={hotspots} />
        ) : (
          // Jika Heatmap MATI: Tampilkan titik-titik (Marker)
          hotspots.map((spot, index) => (
            <CircleMarker
              key={index}
              center={[spot.latitude, spot.longitude]}
              pathOptions={{
                color: spot.status === "BAHAYA" ? "#ef4444" : "#f59e0b",
                fillColor: spot.status === "BAHAYA" ? "#ef4444" : "#f59e0b",
                fillOpacity: 0.6,
                weight: 2,
              }}
              radius={spot.status === "BAHAYA" ? 10 : 7}
            >
              <Popup>
                <div className="p-1">
                  <p className="font-bold text-slate-800">
                    Sinyal Api Terdeteksi
                  </p>
                  <div
                    className={`mt-1 px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                      spot.status === "BAHAYA"
                        ? "bg-red-100 text-red-600"
                        : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    POTENSI {spot.status}
                  </div>
                  <p className="text-xs mt-2 text-slate-500">
                    Risk Score: {spot.risk_score}/100
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          ))
        )}
      </MapContainer>

      {showHeatmap && (
        <div className="absolute bottom-6 left-6 z-1000 bg-white/90 p-3 rounded-xl border shadow-lg backdrop-blur-sm min-w-37.5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            Intensitas Panas
          </p>
          <div className="h-2.5 w-full bg-linear-to-r from-blue-500 via-yellow-400 to-red-600 rounded-full"></div>
          <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-600">
            <span>RENDAH</span>
            <span>EKSTRIM</span>
          </div>
        </div>
      )}
    </div>
  );
}

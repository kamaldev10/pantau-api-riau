"use client";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

// Import plugin heatmap secara dinamis karena butuh objek 'window'
if (typeof window !== "undefined") {
  require("leaflet.heat");
}

export default function HeatmapLayer({ hotspots }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !hotspots.length) return;

    // Transformasi data: [latitude, longitude, intensity]
    // Intensity kita ambil dari risk_score (skala 0 - 1)
    const points = hotspots.map((spot) => [
      spot.latitude,
      spot.longitude,
      spot.risk_score / 100,
    ]);

    // Buat layer heatmap
    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
      gradient: { 0.4: "blue", 0.6: "yellow", 0.8: "orange", 1.0: "red" },
    }).addTo(map);

    // Cleanup: Hapus layer saat komponen unmount atau data berubah
    return () => {
      if (map && heatLayer) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map, hotspots]);

  return null;
}

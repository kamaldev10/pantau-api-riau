"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Map as MapIcon,
  Layers,
  Navigation,
  Info,
  ShieldCheck,
} from "lucide-react";
import { RIAU_DISTRICTS } from "@/lib/riauData";
import Stats from "@/components/Stats";

// Load Map secara dinamis dengan loading state yang lebih manis
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-100h-[550px] w-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-slate-400 font-medium text-sm">
          Menyiapkan Peta Riau...
        </p>
      </div>
    </div>
  ),
});

const SENSOR = process.env.SENSOR || "VIIRS_NOAA20_NRT";

export default function HomePage() {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [days, setDays] = useState(1);

  const [mapView, setMapView] = useState({
    center: [0.5071, 101.4478],
    zoom: 7,
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/hotspots?days=${days}`);
        const json = await res.json();
        if (json.success) setHotspots(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [days]); // Trigger ulang jika 'days' berubah

  const handleLocateMe = () => {
    if (!navigator.geolocation) return alert("Browser tidak mendukung GPS");
    navigator.geolocation.getCurrentPosition((pos) => {
      setMapView({
        center: [pos.coords.latitude, pos.coords.longitude],
        zoom: 13,
      });
    });
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              PantauApi <span className="text-orange-600">Riau</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-base max-w-md">
              Sistem peringatan dini kebakaran hutan lahan gambut berbasis AI
              dan satelit.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <div
              className={`w-2.5 h-2.5 rounded-full ${loading ? "bg-amber-400 animate-pulse" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"}`}
            ></div>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
              {loading ? "Syncing..." : `${SENSOR} ONLINE`}
            </span>
          </div>
        </header>

        <Stats data={hotspots} />

        {/* MAIN CONTROLS (RESPONSIVE GRID) */}
        {!loading && (
          <div className="flex flex-col gap-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 ">
              {/* Dropdown Filter: Full di mobile, Col-5 di desktop */}
              <div className="md:col-span-4">
                <select
                  className="w-full p-3.5 rounded-2xl border border-slate-200 bg-white font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer"
                  onChange={(e) => {
                    const d = RIAU_DISTRICTS.find(
                      (x) => x.name === e.target.value,
                    );
                    if (d) setMapView({ center: d.coords, zoom: d.zoom });
                  }}
                >
                  {RIAU_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Locate Me: Full di mobile, Col-3 di desktop */}
              <button
                onClick={handleLocateMe}
                className="md:col-span-2 flex items-center justify-center gap-2 p-3.5 bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-700 hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                <Navigation size={18} fill="currentColor" />
                <span className="md:hidden lg:inline">Lokasi Saya</span>
              </button>

              {/* Mode Toggle: Full di mobile, Col-3 di desktop */}
              <div className="md:col-span-3 flex bg-slate-200/50 p-1 rounded-2xl border border-slate-200 shadow-inner">
                <button
                  onClick={() => setShowHeatmap(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${!showHeatmap ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <MapIcon size={16} /> TITIK
                </button>
                <button
                  onClick={() => setShowHeatmap(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${showHeatmap ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <Layers size={16} /> HEATMAP
                </button>
              </div>

              {/* Filter Rentang Hari */}
              <div className="md:col-span-3 flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                {[1, 3, 5].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDays(d)}
                    className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                      days === d
                        ? "bg-orange-600 text-white shadow-md"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {d === 1 ? "24 JAM" : `${d} HARI`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DATA VISUALIZATION SECTION */}
        <div className="space-y-6">
          {/* Status Aman (Conditional) */}
          {!loading && hotspots.length === 0 && (
            <div className="flex items-center gap-4 p-5 bg-emerald-50 border border-emerald-100 rounded-3xl animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-emerald-500 p-2.5 rounded-2xl text-white">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-emerald-900 font-black text-sm md:text-base">
                  Langit Riau Cerah
                </p>
                <p className="text-emerald-700/80 text-xs font-medium">
                  Tidak ada ancaman kebakaran terdeteksi saat ini.
                </p>
              </div>
            </div>
          )}

          {/* Map Dashboard */}
          <section className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
            <div className="p-5 md:px-8 border-b bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
                <h2 className="font-black text-slate-800 text-sm uppercase tracking-widest">
                  Live Monitoring Area
                </h2>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Data Refresh: 30 Menit Sekali
              </span>
            </div>

            <div className="p-2 md:p-3 h-112.5dmd:h-150-full">
              <Map
                hotspots={hotspots}
                mapCenter={mapView.center}
                zoomLevel={mapView.zoom}
                showHeatmap={showHeatmap}
              />
            </div>
          </section>

          {/* AI Info Card */}
          <footer className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="p-6 bg-white rounded-4xl border border-slate-100 shadow-sm flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                <Info size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">
                  Algoritma AI Scoring
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Setiap titik dihitung menggunakan normalisasi suhu sensor
                  NOAA-20 (70%) dan tingkat kepercayaan satelit (30%) untuk
                  menentukan level risiko di lahan gambut.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center md:items-end px-4">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-2">
                &copy; 2026 Ali Musthafa Kamal
              </p>
              <p className="text-[9px] font-medium text-slate-400 text-center md:text-right">
                Dikembangkan untuk Deteksi Dini Bahaya Lingkungan <br />
                Provinsi Riau, Indonesia.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}

import { NextResponse } from "next/server";

// --- KONFIGURASI CACHING ---
let globalCache = {};
const CACHE_DURATION = 30 * 60 * 1000; // 30 Menit

// --- KONSTANTA AI SCORING ---
const T_MIN = 300; // Suhu ambang bawah (Kelvin)
const T_MAX = 380; // Suhu ambang atas (Titik api ekstrim)
const W_TEMP = 0.7; // Bobot suhu (70%)
const W_CONF = 0.3; // Bobot kepercayaan satelit (30%)

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  // Ambil jumlah hari dari query param, default ke 1 jika tidak ada
  const days = searchParams.get("days") || "1";

  const currentTime = Date.now();

  const MAP_KEY = process.env.NASA_FIRMS_KEY;
  const AREA_RIAU = "100.00,-1.15,103.45,2.45";
  const SENSOR = process.env.SENSOR || "VIIRS_NOAA20_NRT";

  const cacheKey = `data_riau_${days}`;

  // Cek apakah data untuk "jumlah hari ini" sudah ada di laci dan belum basi
  if (
    globalCache[cacheKey] &&
    currentTime - globalCache[cacheKey].timestamp < CACHE_DURATION
  ) {
    console.log(`Mengambil data ${days} hari dari CACHE`);
    return NextResponse.json({
      success: true,
      total: globalCache[cacheKey].data.length,
      data: globalCache[cacheKey].data,
      source: "cache",
      cache_key: cacheKey,
    });
  }

  console.log(globalCache);

  try {
    // Jalankan URL dengan parameter days dinamis
    const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${MAP_KEY}/${SENSOR}/${AREA_RIAU}/${days}`;

    const response = await fetch(url, { next: { revalidate: 1800 } });
    const csvData = await response.text();

    // console.log("Raw CSV from NASA:", csvData);

    if (csvData.split("\n").length <= 1) {
      console.log("NASA mengembalikan header saja, tidak ada titik api.");
    }

    if (!response.ok || csvData.includes("Invalid")) {
      return NextResponse.json(
        { success: false, message: "NASA API Error atau Key Invalid." },
        { status: 400 },
      );
    }

    // 2. Parsing CSV & Implementasi AI Scoring
    const lines = csvData.split("\n");
    const headers = lines[0].split(",");

    const processedData = lines
      .slice(1)
      .filter((line) => line.trim() !== "")
      .map((line) => {
        const values = line.split(",");
        const obj = {};
        headers.forEach((header, i) => {
          obj[header.trim()] = values[i];
        });

        // --- UPGRADE AI SCORING LOGIC ---
        const T_bright = parseFloat(obj.bright_ti4);

        // Map confidence code ke nilai numerik 0-100
        const C_val =
          obj.confidence === "h" ? 100 : obj.confidence === "n" ? 60 : 30;

        // Rumus Normalisasi: P = ((T - Tmin) / (Tmax - Tmin) * W_temp) + (C / 100 * W_conf)
        // Kita gunakan Math.max/min agar hasil tetap di range 0-1
        const normalizedTemp = Math.min(
          1,
          Math.max(0, (T_bright - T_MIN) / (T_MAX - T_MIN)),
        );
        const normalizedConf = C_val / 100;

        const riskCalculation =
          normalizedTemp * W_TEMP + normalizedConf * W_CONF;
        const finalScore = Math.round(riskCalculation * 100);

        return {
          latitude: parseFloat(obj.latitude),
          longitude: parseFloat(obj.longitude),
          bright_ti4: T_bright,
          confidence: obj.confidence,
          acq_time: obj.acq_time,
          risk_score: finalScore,
          status:
            finalScore >= 75 ? "BAHAYA" : finalScore >= 45 ? "WASPADA" : "AMAN",
        };
      });

    // 3. Update Global Cache
    globalCache[cacheKey] = {
      timestamp: currentTime,
      data: processedData,
    };

    console.log(`Mengambil data ${days} hari dari NASA (Baru)`);

    return NextResponse.json({
      success: true,
      total: processedData.length,
      data: processedData,
      source: "api_nasa",
    });
  } catch (error) {
    console.error("Route Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

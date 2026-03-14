# 🔥 PantauApi Riau - Early Warning System Karhutla

[![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-199903?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)

**PantauApi Riau** adalah aplikasi berbasis website yang dirancang untuk deteksi dini bahaya kebakaran hutan dan lahan (Karhutla) di Provinsi Riau. Dengan memanfaatkan data satelit NASA secara real-time dan pengolahan data berbasis AI sederhana, aplikasi ini memberikan visualisasi risiko yang mudah dipahami oleh masyarakat dan petugas lapangan.

---

## ✨ Fitur Utama

- 🧠 **AI Fire Risk Scoring**: Mengolah data suhu sensor satelit dan tingkat kepercayaan menggunakan algoritma normalisasi untuk menentukan status **BAHAYA**, **WASPADA**, atau **AMAN**.
- 🗺️ **Dual-Mode Interactive Map**:
  - **Mode Titik**: Visualisasi akurat koordinat hotspot dengan informasi detail (suhu, waktu akuisisi, skor risiko).
  - **Mode Heatmap**: Visualisasi kepadatan titik api untuk analisis area kritis (cluster).
- ⚡ **Smart Server Caching**: Mengoptimalkan performa dan kuota API NASA dengan sistem cache otomatis selama 30 menit berdasarkan rentang waktu data.
- ⏳ **Time-Range Filter**: Memungkinkan pengguna melihat data hotspot dari 24 jam terakhir hingga 5 hari ke belakang.
- 📍 **Geolocation "Sekitar Saya"**: Fitur GPS instan untuk memeriksa potensi ancaman api di lokasi pengguna saat ini.
- 📱 **PWA Ready**: Dapat diinstal di perangkat mobile (Android/iOS) dan diakses layaknya aplikasi native.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Maps**: [React-Leaflet](https://react-leaflet.js.org/) & [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Source**: [NASA FIRMS API](https://firms.modaps.eosdis.nasa.gov/api/) (Satelit VIIRS NOAA-20)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🧠 Logika AI Scoring

Aplikasi menggunakan pendekatan _Heuristic Expert System_ untuk menentukan tingkat bahaya. Skor risiko ($Risk$) dihitung dengan rumus bobot normalisasi:

$$Risk = (T_{norm} \times 0.7) + (C_{norm} \times 0.3)$$

Di mana:

- $T_{norm}$: Suhu sensor satelit yang telah dinormalisasi terhadap ambang batas kritis (300K - 380K).
- $C_{norm}$: Tingkat kepercayaan satelit (0 - 1).
- Bobot $70\%$ diberikan pada suhu karena merupakan indikator paling valid di lahan gambut Riau.

---

## 🚀 Instalasi Lokal

1.  Clone repository:

    ```bash
    git clone [https://github.com/kamaldev10/pantauapi-riau.git](https://github.com/kamaldev10/pantauapi-riau.git)
    cd pantauapi-riau
    ```

2.  Instal dependensi:

    ```bash
    npm install
    ```

3.  Setup Environment Variables (`.env.local`):
    Dapatkan API Key di [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/api/config/)

    ```env
    NASA_FIRMS_KEY=your_api_key_here
    ```

4.  Jalankan aplikasi:
    ```bash
    npm run dev
    ```
    Buka [http://localhost:3001](http://localhost:3001) pada browser Anda.

---

© 2026 PantauApi Riau. Dikembangkan untuk masa depan Riau yang bebas asap. 🌿

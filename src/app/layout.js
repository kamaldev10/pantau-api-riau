import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  // Title yang mengandung kata kunci utama (Max 60 karakter)
  title: "PantauApi Riau: Deteksi Dini Karhutla & Titik Api Real-time",

  // Deskripsi persuasif dan kaya keyword (Max 160 karakter)
  description:
    "Pantau titik panas (hotspot) karhutla di Provinsi Riau secara real-time. Menggunakan teknologi AI dan data satelit NASA FIRMS untuk mitigasi bencana kebakaran hutan.",

  // Keyword untuk membantu mesin pencari
  keywords: [
    "PantauApi Riau",
    "Karhutla Riau",
    "Titik Api Riau",
    "Kebakaran Hutan Riau",
    "Hotspot NASA Riau",
    "Deteksi Kebakaran AI",
  ],

  // Author & Verifikasi Dicoding
  authors: [{ name: "Ali Musthafa Kamal" }],
  other: {
    "dicoding:email": "alimusthafakamal@gmail.com",
  },

  // Open Graph untuk Social Media (WhatsApp, Facebook, LinkedIn)
  openGraph: {
    title: "PantauApi Riau - Sistem Deteksi Dini Bahaya Lingkungan",
    description:
      "Lindungi Riau dari kabut asap. Cek sebaran titik api terbaru di lahan gambut secara instan.",
    url: "https://pantauapi-riau.vercel.app",
    siteName: "PantauApi Riau",
    locale: "id_ID",
    type: "website",
    // Pastikan Anda menaruh gambar preview di folder /public/og-image.jpg
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dashboard PantauApi Riau",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "PantauApi Riau: Real-time Fire Watch",
    description:
      "Monitoring titik panas di Riau menggunakan AI & Data Satelit NASA.",
    images: ["/og-image.jpg"],
  },

  // Robots indexing
  robots: {
    index: true,
    follow: true,
  },

  manifest: "/manifest.json",
  themeColor: "#ea580c",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PantauApi Riau",
  },
};

export default function RootLayout({ children }) {
  return (
    // Ganti lang="en" menjadi lang="id" untuk SEO lokal Indonesia
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}

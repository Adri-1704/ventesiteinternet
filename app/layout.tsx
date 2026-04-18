import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "VenteSiteInternet.ch — Achetez et vendez des sites web en Suisse",
  description:
    "La marketplace suisse pour acheter et vendre des sites web, e-commerces, SaaS et noms de domaine. Trouvez votre prochain projet digital.",
  keywords: [
    "vente site internet",
    "acheter site web",
    "marketplace suisse",
    "vendre site e-commerce",
    "nom de domaine suisse",
    "SaaS à vendre",
  ],
  openGraph: {
    title: "VenteSiteInternet.ch — Achetez et vendez des sites web en Suisse",
    description: "La marketplace suisse pour acheter et vendre des sites web.",
    url: "https://ventesiteinternet.ch",
    siteName: "VenteSiteInternet.ch",
    locale: "fr_CH",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}

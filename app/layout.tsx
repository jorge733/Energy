import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "Informes de Generadores · LE Energy",
  description: "Registro de evaluaciones técnicas de grupos electrógenos",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#15181b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={manrope.variable}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}

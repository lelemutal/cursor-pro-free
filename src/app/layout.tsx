import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard Financiero - Análisis de Mercado en Tiempo Real",
  description: "Dashboard interactivo para análisis de bonos, LECAPs, carry trade, acciones, CEDEARs y más. Incluye IA para insights financieros.",
  keywords: "finanzas, bonos, carry trade, LECAPs, acciones, CEDEARs, dashboard, análisis financiero",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} antialiased`}
      >
        <Analytics/>
        {children}
      </body>
    </html>
  );
}

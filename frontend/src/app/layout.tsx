import "./globals.css";
import { Rubik, Rubik_Mono_One } from "next/font/google";
import type { Metadata } from "next";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  weight: ["400", "500", "700", "900"],
  display: "swap"
});

const rubikMono = Rubik_Mono_One({
  subsets: ["latin"],
  variable: "--font-rubik-mono",
  weight: "400",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Meet.XLM — Proof of Attendance on Stellar",
  description:
    "Landing page inspirada na POAP, mostrando o protocolo de presença nativo em Stellar."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${rubik.variable} ${rubikMono.variable}`}>
        {children}
      </body>
    </html>
  );
}

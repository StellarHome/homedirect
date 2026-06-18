import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";

export const metadata: Metadata = {
  title: "HomeDirect — Rent Without the Middleman",
  description:
    "A transparent, blockchain-powered rental marketplace for Nigeria and Africa. No agents. No inflated fees. One flat 5% service fee.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

import Providers from "./providers";

export const metadata: Metadata = {
  title: "DigitalHub",
  description: "Admin-only premium subscription accounts shop"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

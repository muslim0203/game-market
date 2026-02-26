import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

import Providers from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://obunapro.uz"),
  title: {
    default: "ObunaPro — Premium Obuna Akkauntlari Do'koni",
    template: "%s | ObunaPro"
  },
  description:
    "ChatGPT Plus, Gemini Ultra, Canva Pro, Adobe Creative Cloud va boshqa premium xizmatlarni arzon narxda xarid qiling. To'lovdan keyin avtomatik yetkazib berish.",
  keywords: [
    "premium obuna",
    "ChatGPT Plus",
    "Canva Pro",
    "Adobe Creative Cloud",
    "Gemini Ultra",
    "CapCut Pro",
    "digital akkaunt",
    "obuna do'koni",
    "O'zbekiston",
    "arzon premium",
    "avtomatik yetkazib berish"
  ],
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    siteName: "ObunaPro",
    title: "ObunaPro — Premium Obuna Akkauntlari Do'koni",
    description:
      "Premium xizmatlarni arzon narxda, avtomatik yetkazib berish bilan xarid qiling.",
    url: "https://obunapro.uz"
  },
  twitter: {
    card: "summary_large_image",
    title: "ObunaPro — Premium Obuna Do'koni",
    description: "ChatGPT, Canva, Adobe va boshqa premium obunalar."
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "https://obunapro.uz"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uz">
      <body className="min-h-screen text-foreground antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

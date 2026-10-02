import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "KidoTube — Safe Learning & Fun for Kids",
  description:
    "A safe, curated platform for children aged 6–10 with cartoons, poems, educational videos, and fun games. No ads, no inappropriate content.",
  keywords: "kids safe videos, children education, cartoons, poems for kids, educational games",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KidoTube",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        <ServiceWorkerRegister />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

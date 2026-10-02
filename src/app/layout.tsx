import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "KidoTube — Safe Learning & Fun for Kids",
  description:
    "A safe, curated platform for children aged 6–10 with cartoons, poems, educational videos, and fun games. No ads, no inappropriate content.",
  keywords: "kids safe videos, children education, cartoons, poems for kids, educational games",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: "Hillside Logs Fuel - Premium Quality Firewood",
  description: "Premium quality firewood delivered to your door. Sustainable, seasoned firewood for your home and outdoor needs from Hillside Logs Fuel.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
      {
        url: "/icon-32.svg",
        type: "image/svg+xml",
        sizes: "32x32",
      },
      {
        url: "/favicon.ico",
        sizes: "16x16 32x32",
        type: "image/x-icon",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.svg",
        type: "image/svg+xml",
        sizes: "180x180",
      },
    ],
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Hillside Logs Fuel",
    description: "Premium quality firewood delivered to your door",
    url: "https://hillsidelogsfuel.com",
    siteName: "Hillside Logs Fuel",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hillside Logs Fuel",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans bg-background text-foreground">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

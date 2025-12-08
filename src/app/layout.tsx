import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const lora = Lora({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  variable: '--font-lora',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Hillside Logs Fuel - Premium Quality Firewood",
  description: "Premium quality firewood delivered to your door. Sustainable, seasoned firewood for your home and outdoor needs from Hillside Logs Fuel.",
  metadataBase: new URL('https://hillside.vercel.app'),
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.svg', type: 'image/svg+xml' }
    ],
  },
  openGraph: {
    title: "Hillside Logs Fuel",
    description: "Premium quality firewood delivered to your door",
    url: "https://hillside.vercel.app",
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
    <html lang="en" className={`${playfair.variable} ${lora.variable}`}>
      <body className="antialiased min-h-screen flex flex-col font-sans bg-background text-foreground">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

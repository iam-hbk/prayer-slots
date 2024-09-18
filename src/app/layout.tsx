import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Prayer Slots",
  description: "View prayer slots for the IFCM Video Department",
  openGraph: {
    title: "Prayer Slots",
    description: "View prayer slots for the IFCM Video Department",
    url: "https://prayer-slots.techbk.dev",
    siteName: "Prayer Slots",
    images: [
      {
        url: "https://prayer-slots.techbk.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "Prayer Slots",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prayer Slots",
    description: "View prayer slots for the IFCM Video Department",
    images: ["https://prayer-slots.techbk.dev/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-tr from-blue-600 to-orange-500 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}

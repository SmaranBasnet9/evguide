import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BookTestDriveWidget from "@/components/BookTestDriveWidget";
import CookieBanner from "@/components/legal/CookieBanner";
import TrackEngagement from "@/components/tracking/TrackEngagement";
import TrackPageView from "@/components/tracking/TrackPageView";
import TrackRepeatVisit from "@/components/tracking/TrackRepeatVisit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EVGuide AI",
  description: "AI-powered EV research, comparison, and affordability tools for UK buyers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <TrackPageView />
        <TrackEngagement />
        <TrackRepeatVisit />
        {children}
        <BookTestDriveWidget />
        <CookieBanner />
      </body>
    </html>
  );
}

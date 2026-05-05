import type { Metadata } from "next";
import "./globals.css";
import BookTestDriveWidget from "@/components/BookTestDriveWidget";
import CookieBanner from "@/components/legal/CookieBanner";
import { CookieConsentProvider } from "@/components/legal/CookieConsentProvider";
import TrackEngagement from "@/components/tracking/TrackEngagement";
import TrackPageView from "@/components/tracking/TrackPageView";
import TrackRepeatVisit from "@/components/tracking/TrackRepeatVisit";
import PlatformSessionInit from "@/components/platform/PlatformSessionInit";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn("h-full antialiased", "font-sans", geist.variable)}>
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <CookieConsentProvider>
          <PlatformSessionInit />
          <TrackPageView />
          <TrackEngagement />
          <TrackRepeatVisit />
          {children}
          <BookTestDriveWidget />
          <CookieBanner />
        </CookieConsentProvider>
      </body>
    </html>
  );
}

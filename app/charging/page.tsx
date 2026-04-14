import type { Metadata } from "next";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";
import ChargingClient from "@/components/charging/ChargingClient";

export const metadata: Metadata = {
  title: "Find EV Charging Stations | EVGuide AI",
  description:
    "Discover EV charging stations near you. Filter by network, connector type, charging speed, and availability. Get directions instantly.",
};

export default function ChargingPage() {
  return (
    <main className="min-h-screen bg-[#F8FAF9] font-sans text-[#1A1A1A]">
      <PremiumNavbar />
      <ChargingClient />
      <PremiumFooter />
    </main>
  );
}

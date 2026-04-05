import { NextResponse } from "next/server";
import { bankOffers } from "@/data/bankOffers";

export async function GET() {
  const data = [...bankOffers]
    .sort((a, b) => a.interestRate - b.interestRate)
    .map((offer) => ({
      id: offer.id,
      bank: offer.bank,
      interestRate: offer.interestRate,
      processingFee: offer.processingFee,
      tag: offer.tag,
      facilities: offer.facilities ?? [],
    }));

  return NextResponse.json({ data });
}

import { BankOffer } from "@/types";

export const bankOffers: BankOffer[] = [
  {
    id: "green-bank-a",
    bank: "Lender Profile A",
    interestRate: 7.9,
    maxTenureYears: 7,
    maxLtvPercent: 85,
    processingFee: "1.0%",
    tag: "Balanced example",
    facilities: [
      "Early repayment option",
      "Illustrative digital journey",
      "EV-focused example terms",
    ],
    terms: [
      { label: "Interest rate", value: "7.9% illustrative rate" },
      { label: "Maximum tenure", value: "7 years" },
      { label: "Maximum finance", value: "Up to 85% of vehicle value" },
      { label: "Processing fee", value: "1.0% of loan amount" },
    ],
  },
  {
    id: "green-bank-b",
    bank: "Lender Profile B",
    interestRate: 8.1,
    maxTenureYears: 6,
    maxLtvPercent: 80,
    processingFee: "0.8%",
    tag: "Lower fee example",
    facilities: [
      "Illustrative digital upload flow",
      "Example eligibility screening",
      "Flexible repayment window",
    ],
    terms: [
      { label: "Interest rate", value: "8.1% illustrative rate" },
      { label: "Maximum tenure", value: "6 years" },
      { label: "Maximum finance", value: "Up to 80% of vehicle value" },
      { label: "Processing fee", value: "0.8% of loan amount" },
    ],
  },
  {
    id: "green-bank-c",
    bank: "Lender Profile C",
    interestRate: 8.0,
    maxTenureYears: 7,
    maxLtvPercent: 82,
    processingFee: "1.1%",
    tag: "Longer-term example",
    facilities: [
      "Illustrative assisted journey",
      "Consultation support example",
      "Longer term profile",
    ],
    terms: [
      { label: "Interest rate", value: "8.0% illustrative rate" },
      { label: "Maximum tenure", value: "7 years" },
      { label: "Maximum finance", value: "Up to 82% of vehicle value" },
      { label: "Processing fee", value: "1.1% of loan amount" },
    ],
  },
];

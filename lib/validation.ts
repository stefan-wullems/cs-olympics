import { z } from "zod";

const allCSMs = [
  // Red team
  "Sofia", "Emmanuel", "Frida", "Wouter", "Lucas", "Thomas Meulenberg", "Robbert", "Joeri",
  // Blue team
  "Jeannique", "Thomas Alkema", "Isabel", "Evelyne", "Roos", "Carlijn", "Kayleigh",
  // Green team
  "Marloes", "Josephine", "Hidde", "Stefan", "Hubert", "Heyden", "Naomi",
];

const allDealTypes = [
  // Bronze
  "Additional Language", "Lead Forms", "Interactive Articles", "Brand Visibility",
  // Silver
  "Starter → Basic", "Basic → Pro", "Accelerator Package", "SEA", "Early Renewal", "Combo Deal (2 items)",
  // Gold
  "Starter → Pro", "Pro → Enterprise", "Additional Domain", "Referral", "Early Renewal + Upsell", "Combo Deal (3+ items)",
];

const validMedals = ["🥉 Bronze", "🥈 Silver", "🥇 Gold"] as const;

export const DealInputSchema = z.object({
  csm: z.string().refine((csm) => allCSMs.includes(csm), {
    message: "Invalid CSM name",
  }),
  customer: z.string().min(1, "Customer name is required").max(255, "Customer name too long"),
  type: z.string().refine((type) => allDealTypes.includes(type), {
    message: "Invalid deal type",
  }),
  medal: z.enum(validMedals, { message: "Invalid medal type" }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
});

export type DealInput = z.infer<typeof DealInputSchema>;

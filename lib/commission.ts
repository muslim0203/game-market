import type { SellerTier } from "@prisma/client";

export const COMMISSION_RATES: Record<SellerTier, number> = {
  NEW: 0.1,
  VERIFIED: 0.07,
  TOP: 0.05
};

export function calculateCommission(amount: number, tier: SellerTier) {
  const rate = COMMISSION_RATES[tier];
  const commission = Number((amount * rate).toFixed(2));
  const payout = Number((amount - commission).toFixed(2));

  return { rate, commission, payout };
}

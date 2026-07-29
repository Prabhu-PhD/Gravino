"use client";

import { formatFrom, useCurrency } from "@/lib/currency";

export function FromPrice({ inr, className = "" }: { inr: number; className?: string }) {
  const { currency } = useCurrency();
  return <span className={className}>{formatFrom(inr, currency)}</span>;
}

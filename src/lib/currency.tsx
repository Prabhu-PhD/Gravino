"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export const CURRENCIES = ["USD", "EUR", "AED", "INR"] as const;
export type Currency = (typeof CURRENCIES)[number];

/** Fixed conversion constants (refreshed periodically — fine for "from" anchors). */
const RATES: Record<Currency, number> = {
  USD: 0.012,
  EUR: 0.0115,
  AED: 0.044,
  INR: 1,
};

const SYMBOL: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  AED: "AED ",
  INR: "₹",
};

/** Round to a tidy "starting from" figure based on magnitude. */
function roundNice(n: number): number {
  if (n < 50) return Math.round(n);
  if (n < 500) return Math.round(n / 5) * 5;
  if (n < 5000) return Math.round(n / 50) * 50;
  return Math.round(n / 100) * 100;
}

export function formatFrom(inr: number, currency: Currency): string {
  const value = roundNice(inr * RATES[currency]);
  return SYMBOL[currency] + value.toLocaleString("en-US");
}

type CurrencyCtx = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
};

const Ctx = createContext<CurrencyCtx | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setState] = useState<Currency>("USD");

  useEffect(() => {
    const saved = localStorage.getItem("gravino-currency") as Currency | null;
    if (saved && CURRENCIES.includes(saved)) setState(saved);
  }, []);

  const setCurrency = (c: Currency) => {
    setState(c);
    localStorage.setItem("gravino-currency", c);
  };

  return <Ctx.Provider value={{ currency, setCurrency }}>{children}</Ctx.Provider>;
}

export function useCurrency() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

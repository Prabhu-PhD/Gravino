"use client";

import { CURRENCIES, useCurrency } from "@/lib/currency";

export function CurrencyToggle({ className = "" }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div
      role="group"
      aria-label="Display currency"
      className={`inline-flex items-center rounded-pill border border-ink/10 bg-white/50 p-0.5 ${className}`}
    >
      {CURRENCIES.map((c) => {
        const active = c === currency;
        return (
          <button
            key={c}
            type="button"
            onClick={() => setCurrency(c)}
            aria-pressed={active}
            className={`rounded-pill px-2.5 py-1 font-mono text-[0.66rem] tracking-wider transition-colors duration-300 ${
              active ? "bg-ink text-cream" : "text-muted hover:text-ink"
            }`}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}

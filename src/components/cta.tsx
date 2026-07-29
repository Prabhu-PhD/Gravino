import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

export function Cta({ href, children, variant = "primary", className = "" }: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-pill px-5 py-3 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]";
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-violet to-grape text-white shadow-[0_14px_40px_-12px_rgba(109,93,224,0.55)] hover:-translate-y-0.5 hover:shadow-[0_18px_48px_-12px_rgba(109,93,224,0.7)]"
      : "glass-soft text-ink hover:bg-white/75";

  return (
    <a href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </a>
  );
}

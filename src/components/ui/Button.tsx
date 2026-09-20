import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "accent" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-sans font-semibold transition-colors duration-200 ease-calm disabled:cursor-not-allowed disabled:opacity-60";

// Every variant keeps a 44px minimum height, so the same component works as a
// thumb target on mobile without a separate size.
const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-body-sm",
  lg: "min-h-12 px-6 text-body sm:px-7",
};

const variants: Record<Variant, string> = {
  primary: "bg-emerald-800 text-shell hover:bg-emerald-700",
  accent: "bg-gold text-charcoal hover:bg-gold-soft",
  outline: "border border-emerald-800 text-emerald-800 hover:bg-emerald-50",
  ghost:
    "text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800",
};

const variantsOnDark: Record<Variant, string> = {
  primary: "bg-shell text-emerald-900 hover:bg-cream",
  accent: "bg-gold text-emerald-900 hover:bg-gold-soft",
  outline: "border border-emerald-300 text-shell hover:bg-emerald-700",
  ghost: "text-emerald-300 underline decoration-emerald-400 underline-offset-4 hover:text-shell",
};

function classesFor(variant: Variant, size: Size, onDark: boolean, extra: string) {
  const set = onDark ? variantsOnDark : variants;
  return `${base} ${sizes[size]} ${set[variant]} ${extra}`.trim();
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  onDark?: boolean;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  onDark = false,
  className = "",
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={classesFor(variant, size, onDark, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  to,
  variant = "primary",
  size = "md",
  onDark = false,
  className = "",
  children,
  ...rest
}: CommonProps & { to: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <Link to={to} className={classesFor(variant, size, onDark, className)} {...rest}>
      {children}
    </Link>
  );
}

export function ButtonAnchor({
  href,
  variant = "primary",
  size = "md",
  onDark = false,
  className = "",
  children,
  ...rest
}: CommonProps & { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href} className={classesFor(variant, size, onDark, className)} {...rest}>
      {children}
    </a>
  );
}

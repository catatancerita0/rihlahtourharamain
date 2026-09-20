import type { ElementType, ReactNode } from "react";
import { useReveal } from "../../hooks/useReveal";

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function Reveal({ children, className = "", as }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <Tag ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}>
      {children}
    </Tag>
  );
}

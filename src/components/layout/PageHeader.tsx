import type { ReactNode } from "react";
import { Seo } from "../Seo";
import { GeometricMotif } from "../ui/GeometricMotif";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: ReactNode;
  /** Only pages that genuinely open a chapter get the motif. */
  motif?: boolean;
}

export function PageHeader({ eyebrow, title, intro, children, motif = false }: PageHeaderProps) {
  return (
    <section className="on-dark relative overflow-hidden bg-emerald-800 text-shell">
      <Seo title={title} description={intro} />
      <div className="shell-container relative py-section-sm sm:py-section">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-display-lg">{title}</h1>
        {intro ? (
          <p className="mt-5 max-w-prose text-body-lg text-emerald-100">{intro}</p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
      {motif ? (
        <GeometricMotif className="h-7 w-full text-emerald-700" scale={30} />
      ) : null}
    </section>
  );
}

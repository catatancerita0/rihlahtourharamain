import { GeometricMotif } from "./GeometricMotif";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "start" | "center";
  onDark?: boolean;
  /** Motif divider is reserved for the few sections that open a new chapter. */
  motif?: boolean;
  headingId?: string;
  as?: "h2" | "h3";
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "start",
  onDark = false,
  motif = false,
  headingId,
  as = "h2",
}: SectionHeadingProps) {
  const Tag = as;
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex max-w-prose flex-col gap-4 ${alignment}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <Tag
        id={headingId}
        className={`text-display-md ${onDark ? "text-shell" : "text-emerald-900"}`}
      >
        {title}
      </Tag>
      {motif ? (
        <GeometricMotif
          className={`h-6 w-32 ${onDark ? "text-emerald-300" : "text-emerald-300"}`}
          scale={26}
        />
      ) : null}
      {intro ? (
        <p className={`text-body-lg ${onDark ? "text-emerald-100" : "text-charcoal-soft"}`}>
          {intro}
        </p>
      ) : null}
    </div>
  );
}

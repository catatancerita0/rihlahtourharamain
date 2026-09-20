import { useState } from "react";
import { useCopy } from "../../i18n/LanguageProvider";
import { mediaCopy } from "../../i18n/strings";
import { assetUrl } from "../../lib/media";

/**
 * Ratios are fixed here as complete class strings. Tailwind reads source text,
 * so a ratio assembled at runtime would never be generated in the stylesheet.
 */
const RATIO_CLASS = {
  "4/5": "aspect-[4/5]",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-[16/9]",
  "1/1": "aspect-square",
} as const;

export type MediaRatio = keyof typeof RATIO_CLASS;

interface MediaProps {
  /** A path inside public/, or a full URL. null renders the gap state. */
  src: string | null | undefined;
  /** What the photo shows. Required, because a photo nobody can describe is not published. */
  alt: string;
  ratio?: MediaRatio;
  className?: string;
  /** Text for the waiting state, so an empty slot explains itself. */
  slotLabel?: string;
  slotNote?: string;
  /** The slot sits on an emerald panel on some pages. */
  onDark?: boolean;
  /** Above-the-fold images load eagerly; the rest wait until they scroll near. */
  priority?: boolean;
}

/**
 * One image primitive for the whole site. It reserves the box before the file
 * arrives, so a late photo cannot shift the layout, and it degrades to a
 * labelled slot when the reference is empty or the file is missing.
 */
export function Media({
  src,
  alt,
  ratio = "4/3",
  className = "",
  slotLabel,
  slotNote,
  onDark = false,
  priority = false,
}: MediaProps) {
  const [failed, setFailed] = useState(false);
  const copy = useCopy(mediaCopy);
  const resolved = assetUrl(src);
  const box = `overflow-hidden rounded-lg ${RATIO_CLASS[ratio]}`;

  if (!resolved || failed) {
    const frame = onDark
      ? "border-emerald-300 bg-emerald-900/40 text-emerald-100"
      : "border-emerald-300 bg-emerald-50/60 text-charcoal-soft";

    return (
      <div className={`${box} flex flex-col justify-end border border-dashed p-5 ${frame} ${className}`}>
        <p
          className={`text-label font-semibold uppercase ${onDark ? "text-emerald-300" : "text-charcoal-muted"}`}
        >
          {slotLabel ?? copy.slotLabel}
        </p>
        {failed ? (
          <>
            <p className={`mt-1 text-body-sm font-semibold ${onDark ? "text-shell" : "text-emerald-900"}`}>
              {copy.fileMissing}
            </p>
            <p className="mt-1 text-body-sm">{copy.fileMissingNote}</p>
          </>
        ) : slotNote ? (
          <p className={`mt-1 text-body-sm ${onDark ? "text-emerald-100" : "text-charcoal-soft"}`}>
            {slotNote}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`${box} ${className}`}>
      <img
        src={resolved}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

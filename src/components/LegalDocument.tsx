import { useCopy } from "../i18n/LanguageProvider";
import type { Localized } from "../i18n/types";

export interface LegalSection {
  id: string;
  heading: string;
  /** Statements that are true of this website or already fixed by the business. */
  body: string[];
  /** Points the business still has to supply. Rendered as a labelled gap. */
  pending?: string[];
}

interface LegalDocumentProps {
  sections: LegalSection[];
  /** Left null until the business approves a version, so no fake date appears. */
  lastUpdated?: string | null;
}

const idCopy = {
  updated: (date: string) => `Terakhir diperbarui ${date}.`,
  noDate:
    "Dokumen ini belum diberi tanggal berlaku karena masih menunggu persetujuan penyelenggara.",
  pendingHeading: "Bagian yang masih harus diisi penyelenggara",
};

const enCopy: typeof idCopy = {
  updated: (date: string) => `Last updated ${date}.`,
  noDate:
    "This document has no effective date yet because the organiser's approval is still pending.",
  pendingHeading: "Sections the organiser still has to fill in",
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

export function LegalDocument({ sections, lastUpdated }: LegalDocumentProps) {
  const c = useCopy(copy);

  return (
    <div className="flex flex-col gap-10">
      <p className="text-body-sm text-charcoal-muted">
        {lastUpdated ? c.updated(lastUpdated) : c.noDate}
      </p>

      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-28">
          <h2 className="text-display-sm text-emerald-900">{section.heading}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph} className="mt-4 max-w-prose text-body text-charcoal-soft">
              {paragraph}
            </p>
          ))}
          {section.pending && section.pending.length > 0 ? (
            <div className="mt-5 rounded-lg border border-dashed border-emerald-300 bg-emerald-50/60 p-5">
              <p className="text-label font-semibold text-charcoal-soft">{c.pendingHeading}</p>
              <ul className="mt-3 flex flex-col gap-2">
                {section.pending.map((item) => (
                  <li key={item} className="flex gap-2 text-body-sm text-charcoal-soft">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}

import { Link } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";
import { SectionHeading } from "../components/ui/SectionHeading";
import { useContent } from "../content/ContentProvider";
import { useCopy, usePick } from "../i18n/LanguageProvider";
import type { Localized } from "../i18n/types";

/**
 * Only the labels and the section headings live here. The body copy comes from
 * the content bundle, because that is the text the business revises: the four
 * commitments and the limits of service are the first things to change.
 */
const idCopy = {
  eyebrow: "Tentang Kami",
  title: "Rihlah Tour Haramain",
  seePackages: "Lihat Paket Umrah",
  seeLicensing: "Lihat data legalitas",
  howEyebrow: "Cara kami bekerja",
  howTitle: "Layanan yang bisa Anda minta",
  compare: "Bandingkan tiga program Umrah",
  limitsEyebrow: "Batas layanan",
  limitsTitle: "Yang tidak bisa kami janjikan",
  limitsIntro: "Menuliskan batas ini lebih berguna daripada menambah klaim.",
  writeEyebrow: "Cara kami menulis",
  writeTitle: "Kenapa kami menulis seperti ini",
  writeBody:
    "Calon jamaah biasanya membandingkan beberapa penyelenggara. Perbandingan itu hanya adil kalau tiap penawaran memisahkan yang termasuk dan yang tidak termasuk. Empat alasan di bawah ini yang paling sering menentukan keputusan.",
  linkPembimbing: "Lihat halaman pembimbing",
  linkLicensing: "Periksa identitas resmi penyelenggara",
  linkConsult: "Mulai konsultasi",
};

const enCopy: typeof idCopy = {
  eyebrow: "About Us",
  title: "Rihlah Tour Haramain",
  seePackages: "See Umrah packages",
  seeLicensing: "See licensing data",
  howEyebrow: "How we work",
  howTitle: "What you can ask us to do",
  compare: "Compare the three Umrah programmes",
  limitsEyebrow: "Limits of the service",
  limitsTitle: "What we cannot promise",
  limitsIntro: "Writing these limits down is more useful than adding another claim.",
  writeEyebrow: "How we write",
  writeTitle: "Why we write this way",
  writeBody:
    "Prospective pilgrims usually compare several organisers. That comparison is only fair when each offer separates what is included from what is not. The four points below are the ones that most often decide the choice.",
  linkPembimbing: "See who accompanies the group",
  linkLicensing: "Check the organiser's official identity",
  linkConsult: "Start a consultation",
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

const linkClass =
  "rounded-sm text-body-sm font-semibold text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800";

export function AboutPage() {
  const c = useCopy(copy);
  const L = usePick();
  const { about, reasons } = useContent();

  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} intro={L(about.intro)}>
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/paket-umrah" variant="primary" size="lg" onDark>
            {c.seePackages}
          </ButtonLink>
          <ButtonLink to="/legalitas" variant="outline" size="lg" onDark>
            {c.seeLicensing}
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div className="flex flex-col gap-6">
              <SectionHeading eyebrow={c.howEyebrow} title={c.howTitle} intro={L(about.howIntro)} />
              <div className="flex flex-col gap-4">
                <p className="max-w-prose text-body-lg text-charcoal-soft">
                  {L(about.programsBody)}
                </p>
                <p className="max-w-prose text-body text-charcoal-soft">
                  {L(about.consultationBody)}
                </p>
              </div>
              <ButtonLink to="/paket-umrah" variant="outline" className="self-start">
                {c.compare}
              </ButtonLink>
            </div>

            <div className="flex flex-col gap-5">
              {about.commitments.map((item) => (
                <div key={item.id} className="border-t border-emerald-100 pt-5">
                  <h3 className="text-body-lg font-semibold text-emerald-900">{L(item.title)}</h3>
                  <p className="mt-2 max-w-prose text-body-sm text-charcoal-soft">{L(item.body)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="shell-container">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <SectionHeading
              eyebrow={c.limitsEyebrow}
              title={c.limitsTitle}
              intro={c.limitsIntro}
            />
            <ul className="flex flex-col gap-4">
              {L(about.scopeLimits).map((item) => (
                <li
                  key={item}
                  className="flex gap-3 border-b border-emerald-200 pb-4 text-body text-charcoal-soft"
                >
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-tight bg-shell">
        <div className="shell-container">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div className="flex flex-col gap-4">
              <h2 className="text-display-md text-emerald-900">{c.writeTitle}</h2>
              <p className="max-w-prose text-body text-charcoal-soft">{c.writeBody}</p>
            </div>
            <ol className="flex flex-col gap-5">
              {reasons.map((reason, index) => (
                <li key={reason.id} className="flex gap-4 border-t border-emerald-100 pt-5">
                  <span className="tabular font-display text-2xl text-emerald-800">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-body font-semibold text-emerald-900">{L(reason.title)}</h3>
                    <p className="mt-1 max-w-prose text-body-sm text-charcoal-soft">
                      {L(reason.description)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-12 flex flex-wrap gap-4 border-t border-emerald-100 pt-8">
            <Link to="/pembimbing" className={linkClass}>
              {c.linkPembimbing}
            </Link>
            <Link to="/legalitas" className={linkClass}>
              {c.linkLicensing}
            </Link>
            <Link to="/konsultasi" className={linkClass}>
              {c.linkConsult}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

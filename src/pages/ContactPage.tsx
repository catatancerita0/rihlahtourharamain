import { ContactChannels, ContactPendingNotice } from "../components/ContactChannels";
import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";
import { SectionHeading } from "../components/ui/SectionHeading";
import { isPlaceholder, site } from "../config/site";
import { useCopy, useLang } from "../i18n/LanguageProvider";
import { chrome } from "../i18n/strings";
import type { Localized } from "../i18n/types";

const idCopy = {
  eyebrow: "Kontak",
  title: "Hubungi Rihlah Tour Haramain",
  intro:
    "Konsultasi program, pertanyaan dokumen, dan kebutuhan perjalanan lain dilayani lewat kanal di bawah ini.",
  channelsEyebrow: "Kanal resmi",
  channelsTitle: "Pilih kanal yang sesuai",
  channelsIntro: "Gunakan kanal ini saja untuk mengirim data atau melakukan pembayaran.",
  visitTitle: "Kunjungan kantor",
  visitBody:
    "Konsultasi berjalan online, jadi Anda bisa memulai dari kota mana pun. Kunjungan ke kantor dilakukan dengan janji temu lebih dulu supaya tim yang Anda butuhkan bisa hadir.",
  address: "Alamat",
  addressPending: "Alamat kantor belum diisi, akan dicantumkan setelah ditetapkan.",
  hours: "Jam layanan",
  hoursPending: "Belum diisi, akan dicantumkan setelah ditetapkan.",
  trustTitle: "Cara mengenali pesan yang bukan dari kami",
  trustPoints: [
    "Nomor dan rekening resmi hanya yang tercantum di halaman ini dan di halaman legalitas.",
    "Kami tidak meminta pembayaran sebelum penawaran tertulis Anda setujui.",
    "Kami tidak meminta dokumen lewat tautan yang tidak bisa diverifikasi dari situs ini.",
    "Kalau ada permintaan yang terasa mendesak atau berbeda, konfirmasi dulu lewat kanal resmi.",
  ],
};

const enCopy: typeof idCopy = {
  eyebrow: "Contact",
  title: "Contact Rihlah Tour Haramain",
  intro:
    "Programme consultations, document questions and other travel needs are handled through the channels below.",
  channelsEyebrow: "Official channels",
  channelsTitle: "Choose the right channel",
  channelsIntro: "Use these channels only for sending data or making a payment.",
  visitTitle: "Visiting the office",
  visitBody:
    "Consultations happen online, so you can start from any city. Office visits are arranged by appointment first, so the people you need are actually there when you arrive.",
  address: "Address",
  addressPending: "The office address has not been filled in yet and will be listed once it is set.",
  hours: "Service hours",
  hoursPending: "Not filled in yet, and will be listed once it is set.",
  trustTitle: "How to spot a message that is not from us",
  trustPoints: [
    "Official numbers and bank accounts are only the ones listed on this page and on the licensing page.",
    "We do not ask for payment before you accept a written offer.",
    "We do not ask for documents through a link that cannot be verified from this site.",
    "If a request feels urgent or unusual, confirm it through the official channels first.",
  ],
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

export function ContactPage() {
  const c = useCopy(copy);
  const lang = useLang();

  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro} />

      <section className="section bg-shell">
        <div className="shell-container">
          <SectionHeading
            as="h2"
            eyebrow={c.channelsEyebrow}
            title={c.channelsTitle}
            intro={c.channelsIntro}
          />
          <div className="mt-8">
            <ContactChannels />
          </div>
          <div className="mt-8">
            <ContactPendingNotice />
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="shell-container">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-display-sm text-emerald-900">{c.visitTitle}</h2>
              <p className="mt-4 max-w-prose text-body text-charcoal-soft">{c.visitBody}</p>
              <dl className="mt-6 flex flex-col gap-4">
                <div>
                  <dt className="text-label font-semibold uppercase text-charcoal-muted">
                    {c.address}
                  </dt>
                  <dd className="mt-1 text-body text-charcoal-soft">
                    {isPlaceholder(site.addressLines.join(""))
                      ? c.addressPending
                      : site.addressLines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                  </dd>
                </div>
                <div>
                  <dt className="text-label font-semibold uppercase text-charcoal-muted">
                    {c.hours}
                  </dt>
                  <dd className="mt-1 text-body text-charcoal-soft">
                    {isPlaceholder(site.serviceHours) ? c.hoursPending : site.serviceHours}
                  </dd>
                </div>
              </dl>
              <ButtonLink to="/konsultasi" variant="primary" className="mt-6">
                {chrome[lang].cta.consultPlan}
              </ButtonLink>
            </div>

            <div className="rounded-lg border border-emerald-100 bg-shell p-5 sm:p-6">
              <h2 className="text-body-lg font-semibold text-emerald-900">{c.trustTitle}</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {c.trustPoints.map((item) => (
                  <li key={item} className="flex gap-3 text-body-sm text-charcoal-soft">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

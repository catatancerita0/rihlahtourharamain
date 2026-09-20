import { ContactChannels, ContactPendingNotice } from "../components/ContactChannels";
import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";
import { SectionHeading } from "../components/ui/SectionHeading";
import { isPlaceholder, site } from "../config/site";

export function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Kontak"
        title="Hubungi Rihlah Tour Haramain"
        intro="Konsultasi program, pertanyaan dokumen, dan kebutuhan perjalanan lain dilayani lewat kanal di bawah ini."
      />

      <section className="section bg-shell">
        <div className="shell-container">
          <SectionHeading
            as="h2"
            eyebrow="Kanal resmi"
            title="Pilih kanal yang sesuai"
            intro="Gunakan kanal ini saja untuk mengirim data atau melakukan pembayaran."
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
              <h2 className="text-display-sm text-emerald-900">Kunjungan kantor</h2>
              <p className="mt-4 max-w-prose text-body text-charcoal-soft">
                Konsultasi berjalan online, jadi Anda bisa memulai dari kota mana pun. Kunjungan ke
                kantor dilakukan dengan janji temu lebih dulu supaya tim yang Anda butuhkan bisa
                hadir.
              </p>
              <dl className="mt-6 flex flex-col gap-4">
                <div>
                  <dt className="text-label font-semibold uppercase text-charcoal-muted">Alamat</dt>
                  <dd className="mt-1 text-body text-charcoal-soft">
                    {isPlaceholder(site.addressLines.join(""))
                      ? "Alamat kantor belum diisi, akan dicantumkan setelah ditetapkan."
                      : site.addressLines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                  </dd>
                </div>
                <div>
                  <dt className="text-label font-semibold uppercase text-charcoal-muted">
                    Jam layanan
                  </dt>
                  <dd className="mt-1 text-body text-charcoal-soft">
                    {isPlaceholder(site.serviceHours)
                      ? "Belum diisi, akan dicantumkan setelah ditetapkan."
                      : site.serviceHours}
                  </dd>
                </div>
              </dl>
              <ButtonLink to="/konsultasi" variant="primary" className="mt-6">
                Mulai konsultasi
              </ButtonLink>
            </div>

            <div className="rounded-lg border border-emerald-100 bg-shell p-5 sm:p-6">
              <h2 className="text-body-lg font-semibold text-emerald-900">
                Cara mengenali pesan yang bukan dari kami
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {[
                  "Nomor dan rekening resmi hanya yang tercantum di halaman ini dan di halaman legalitas.",
                  "Kami tidak meminta pembayaran sebelum penawaran tertulis Anda setujui.",
                  "Kami tidak meminta dokumen lewat tautan yang tidak bisa diverifikasi dari situs ini.",
                  "Kalau ada permintaan yang terasa mendesak atau berbeda, konfirmasi dulu lewat kanal resmi.",
                ].map((item) => (
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

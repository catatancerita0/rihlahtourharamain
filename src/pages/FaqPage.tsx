import { FAQAccordion } from "../components/FAQAccordion";
import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";
import { faqCategories, faqs } from "../content/faq";

export function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Pertanyaan yang benar-benar ditanyakan jamaah"
        intro="Pertanyaan di bawah berasal dari hal yang paling sering menghambat pendaftaran. Jawabannya menyebut apa yang sudah pasti, dan menunjuk halaman lain untuk bagian yang diatur di sana."
      />

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            <div className="flex flex-col gap-12">
              {faqCategories.map((category) => (
                <div key={category}>
                  <h2 className="text-display-sm text-emerald-900">{category}</h2>
                  <div className="mt-5">
                    <FAQAccordion
                      items={faqs.filter((item) => item.category === category)}
                      idPrefix={`faq-${category.toLowerCase()}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-lg border border-emerald-100 bg-cream p-5">
                <h2 className="text-body-lg font-semibold text-emerald-900">
                  Pertanyaan Anda belum ada di sini?
                </h2>
                <p className="mt-2 text-body-sm text-charcoal-soft">
                  Sampaikan situasi Anda secara singkat. Pertanyaan yang sering muncul akan
                  ditambahkan ke halaman ini beserta jawabannya.
                </p>
                <ButtonLink to="/konsultasi" variant="primary" className="mt-4">
                  Kirim pertanyaan
                </ButtonLink>
              </div>

              <div className="rounded-lg border border-emerald-100 bg-shell p-5">
                <h2 className="text-body-lg font-semibold text-emerald-900">Baca juga</h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {[
                    { label: "Syarat dan ketentuan", to: "/syarat-ketentuan" },
                    { label: "Pembatalan dan refund", to: "/pembatalan-refund" },
                    { label: "Kebijakan privasi", to: "/kebijakan-privasi" },
                    { label: "Legalitas dan keamanan", to: "/legalitas" },
                  ].map((item) => (
                    <li key={item.to}>
                      <ButtonLink to={item.to} variant="outline" className="w-full">
                        {item.label}
                      </ButtonLink>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

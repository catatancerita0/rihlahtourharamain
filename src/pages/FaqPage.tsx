import { FAQAccordion } from "../components/FAQAccordion";
import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";
import { useContent } from "../content/ContentProvider";
import { faqCategoriesFor, faqsForLabel } from "../content/faq";
import { useCopy, useLang } from "../i18n/LanguageProvider";
import type { Localized } from "../i18n/types";

const idCopy = {
  title: "Pertanyaan yang benar-benar ditanyakan jamaah",
  intro:
    "Pertanyaan di bawah berasal dari hal yang paling sering menghambat pendaftaran. Jawabannya menyebut apa yang sudah pasti, dan menunjuk halaman lain untuk bagian yang diatur di sana.",
  missingTitle: "Pertanyaan Anda belum ada di sini?",
  missingBody:
    "Sampaikan situasi Anda secara singkat. Pertanyaan yang sering muncul akan ditambahkan ke halaman ini beserta jawabannya.",
  askButton: "Kirim pertanyaan",
  alsoRead: "Baca juga",
  links: [
    { label: "Syarat dan ketentuan", to: "/syarat-ketentuan" },
    { label: "Pembatalan dan refund", to: "/pembatalan-refund" },
    { label: "Kebijakan privasi", to: "/kebijakan-privasi" },
    { label: "Legalitas dan keamanan", to: "/legalitas" },
  ],
};

const enCopy: typeof idCopy = {
  title: "Questions pilgrims actually ask",
  intro:
    "The questions below come from the things that most often hold registration up. The answers state what is settled, and point to another page for anything governed there.",
  missingTitle: "Your question is not here yet?",
  missingBody:
    "Tell us your situation briefly. Questions that come up often are added to this page together with the answer.",
  askButton: "Send a question",
  alsoRead: "Also worth reading",
  links: [
    { label: "Terms and conditions", to: "/syarat-ketentuan" },
    { label: "Cancellation and refund", to: "/pembatalan-refund" },
    { label: "Privacy policy", to: "/kebijakan-privasi" },
    { label: "Licensing and safety", to: "/legalitas" },
  ],
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

export function FaqPage() {
  const c = useCopy(copy);
  const lang = useLang();
  const { faqs } = useContent();
  const categories = faqCategoriesFor(faqs, lang);

  return (
    <>
      <PageHeader eyebrow="FAQ" title={c.title} intro={c.intro} />

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            <div className="flex flex-col gap-12">
              {categories.map((category, index) => (
                <div key={category}>
                  <h2 className="text-display-sm text-emerald-900">{category}</h2>
                  <div className="mt-5">
                    <FAQAccordion
                      items={faqsForLabel(faqs, category, lang)}
                      idPrefix={`faq-group-${index}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-lg border border-emerald-100 bg-cream p-5">
                <h2 className="text-body-lg font-semibold text-emerald-900">{c.missingTitle}</h2>
                <p className="mt-2 text-body-sm text-charcoal-soft">{c.missingBody}</p>
                <ButtonLink to="/konsultasi" variant="primary" className="mt-4">
                  {c.askButton}
                </ButtonLink>
              </div>

              <div className="rounded-lg border border-emerald-100 bg-shell p-5">
                <h2 className="text-body-lg font-semibold text-emerald-900">{c.alsoRead}</h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {c.links.map((item) => (
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

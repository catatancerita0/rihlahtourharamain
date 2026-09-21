import { useState } from "react";
import { ArticleCard } from "../components/ArticleCard";
import { PageHeader } from "../components/layout/PageHeader";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { SectionHeading } from "../components/ui/SectionHeading";
import { articleCategoriesFor, articles } from "../content/articles";
import { pendingGuideTopics } from "../content/site-content";
import { useCopy, useLang, usePick } from "../i18n/LanguageProvider";
import type { Localized } from "../i18n/types";

const idCopy = {
  eyebrow: "Panduan Jamaah",
  title: "Persiapan yang bisa dimulai sebelum tanggal ditetapkan",
  intro:
    "Tulisan di sini membahas dokumen, perlengkapan, manasik, dan ritme perjalanan bersama orang tua. Semuanya berguna apa pun program yang akhirnya Anda pilih.",
  categoryLabel: "Kategori",
  all: (count: number) => `Semua (${count})`,
  emptyTitle: "Belum ada panduan pada kategori ini.",
  emptyBody: "Pilih kategori lain, atau lihat semua panduan yang sudah diterbitkan.",
  showAll: "Tampilkan semua panduan",
  pendingEyebrow: "Dalam penyusunan",
  pendingTitle: "Kategori yang belum diterbitkan",
  pendingIntro:
    "Tulisan ditambahkan setelah materinya lengkap, bukan untuk memenuhi jumlah halaman.",
  notPublished: "Belum terbit",
};

const enCopy: typeof idCopy = {
  eyebrow: "Pilgrim guides",
  title: "Preparation you can start before a date is set",
  intro:
    "The writing here covers documents, packing, the manasik briefing, and travelling at the pace your parents need. All of it is useful whichever programme you end up choosing.",
  categoryLabel: "Category",
  all: (count: number) => `All (${count})`,
  emptyTitle: "No guide in this category yet.",
  emptyBody: "Choose another category, or look at every guide that has been published.",
  showAll: "Show all guides",
  pendingEyebrow: "In preparation",
  pendingTitle: "Categories not published yet",
  pendingIntro:
    "Writing is added once the material is complete, not to reach a target number of pages.",
  notPublished: "Not published yet",
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

export function GuidePage() {
  const c = useCopy(copy);
  const L = usePick();
  const lang = useLang();
  const categories = articleCategoriesFor(articles, lang);
  // The selected category is held as a position rather than a label, because the
  // label changes with the language and a stored label would stop matching the
  // moment a reader switches language.
  const [categoryIndex, setCategoryIndex] = useState<number | null>(null);
  const activeLabel = categoryIndex === null ? null : categories[categoryIndex];
  const visible =
    activeLabel === null
      ? articles
      : articles.filter((item) => item.category[lang] === activeLabel);
  const [featured, ...rest] = visible;

  function optionClass(selected: boolean): string {
    return `flex min-h-11 items-center rounded-md border px-4 text-body-sm font-semibold ${
      selected
        ? "border-emerald-800 bg-emerald-800 text-shell"
        : "border-emerald-400 text-emerald-800 hover:bg-emerald-50"
    }`;
  }

  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro} />

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-body-sm font-semibold text-charcoal">{c.categoryLabel}</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategoryIndex(null)}
                aria-pressed={categoryIndex === null}
                className={optionClass(categoryIndex === null)}
              >
                {c.all(articles.length)}
              </button>
              {categories.map((label, index) => {
                const count = articles.filter((item) => item.category[lang] === label).length;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setCategoryIndex(index)}
                    aria-pressed={categoryIndex === index}
                    className={optionClass(categoryIndex === index)}
                  >
                    {label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10">
            {visible.length === 0 ? (
              <EmptyState
                title={c.emptyTitle}
                description={c.emptyBody}
                action={
                  <Button type="button" variant="outline" onClick={() => setCategoryIndex(null)}>
                    {c.showAll}
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
                <ArticleCard article={featured} featured />
                <ul className="flex flex-col gap-5">
                  {rest.map((article) => (
                    <li key={article.id}>
                      <ArticleCard article={article} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-tight bg-cream">
        <div className="shell-container">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
            <SectionHeading
              eyebrow={c.pendingEyebrow}
              title={c.pendingTitle}
              intro={c.pendingIntro}
            />
            <ul className="grid gap-3 sm:grid-cols-2">
              {pendingGuideTopics.map((topic) => {
                const label = L(topic);
                return (
                  <li
                    key={label}
                    className="flex items-center justify-between gap-3 rounded-md border border-dashed border-emerald-300 bg-shell px-4 py-3 text-body-sm"
                  >
                    <span className="font-semibold text-charcoal-soft">{label}</span>
                    <span className="text-charcoal-muted">{c.notPublished}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

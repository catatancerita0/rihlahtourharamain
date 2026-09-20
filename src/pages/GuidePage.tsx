import { useState } from "react";
import { ArticleCard } from "../components/ArticleCard";
import { PageHeader } from "../components/layout/PageHeader";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { SectionHeading } from "../components/ui/SectionHeading";
import { articleCategories, articles } from "../content/articles";
import { pendingGuideTopics } from "../content/site-content";

export function GuidePage() {
  const [category, setCategory] = useState<string>("semua");
  const visible =
    category === "semua" ? articles : articles.filter((item) => item.category === category);
  const [featured, ...rest] = visible;

  return (
    <>
      <PageHeader
        eyebrow="Panduan Jamaah"
        title="Persiapan yang bisa dimulai sebelum tanggal ditetapkan"
        intro="Tulisan di sini membahas dokumen, perlengkapan, manasik, dan ritme perjalanan bersama orang tua. Semuanya berguna apa pun program yang akhirnya Anda pilih."
      />

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-body-sm font-semibold text-charcoal">Kategori</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategory("semua")}
                aria-pressed={category === "semua"}
                className={`flex min-h-11 items-center rounded-md border px-4 text-body-sm font-semibold ${
                  category === "semua"
                    ? "border-emerald-800 bg-emerald-800 text-shell"
                    : "border-emerald-400 text-emerald-800 hover:bg-emerald-50"
                }`}
              >
                Semua ({articles.length})
              </button>
              {articleCategories.map((item) => {
                const count = articles.filter((article) => article.category === item).length;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    aria-pressed={category === item}
                    className={`flex min-h-11 items-center rounded-md border px-4 text-body-sm font-semibold ${
                      category === item
                        ? "border-emerald-800 bg-emerald-800 text-shell"
                        : "border-emerald-400 text-emerald-800 hover:bg-emerald-50"
                    }`}
                  >
                    {item} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10">
            {visible.length === 0 ? (
              <EmptyState
                title="Belum ada panduan pada kategori ini."
                description="Pilih kategori lain, atau lihat semua panduan yang sudah diterbitkan."
                action={
                  <Button type="button" variant="outline" onClick={() => setCategory("semua")}>
                    Tampilkan semua panduan
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
              eyebrow="Dalam penyusunan"
              title="Kategori yang belum diterbitkan"
              intro="Tulisan ditambahkan setelah materinya lengkap, bukan untuk memenuhi jumlah halaman."
            />
            <ul className="grid gap-3 sm:grid-cols-2">
              {pendingGuideTopics.map((topic) => (
                <li
                  key={topic}
                  className="flex items-center justify-between gap-3 rounded-md border border-dashed border-emerald-300 bg-shell px-4 py-3 text-body-sm"
                >
                  <span className="font-semibold text-charcoal-soft">{topic}</span>
                  <span className="text-charcoal-muted">Belum terbit</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

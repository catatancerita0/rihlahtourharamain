import { Link, useParams } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { estimateReadingMinutes, getArticleBySlug, articles } from "../content/articles";
import type { ArticleBlock } from "../content/types";
import { formatDeparture } from "../lib/format";
import { Tag } from "../components/ui/Tag";

function Block({ block }: { block: ArticleBlock }) {
  if (block.kind === "heading") {
    return <h2 className="mt-10 text-display-sm text-emerald-900">{block.text}</h2>;
  }
  if (block.kind === "note") {
    return (
      <aside className="mt-8 rounded-lg border border-emerald-200 bg-cream p-5">
        <p className="text-label font-semibold uppercase text-charcoal-muted">Catatan</p>
        <p className="mt-2 text-body-sm text-charcoal-soft">{block.text}</p>
      </aside>
    );
  }
  if (block.kind === "list") {
    return (
      <ul className="mt-5 flex flex-col gap-2">
        {block.items.map((item) => (
          <li key={item} className="flex gap-2 text-body text-charcoal-soft">
            <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-emerald-400" />
            {item}
          </li>
        ))}
      </ul>
    );
  }
  return <p className="mt-5 text-body-lg text-charcoal-soft">{block.text}</p>;
}

export function GuideArticlePage() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="section bg-shell">
        <div className="shell-container">
          <EmptyState
            title="Panduan ini tidak ditemukan."
            description="Alamat yang Anda buka tidak cocok dengan panduan yang sudah diterbitkan. Daftar lengkapnya ada di halaman panduan jamaah."
            action={
              <ButtonLink to="/panduan" variant="primary">
                Lihat semua panduan jamaah
              </ButtonLink>
            }
          />
        </div>
      </div>
    );
  }

  const published = formatDeparture(article.publishedAt);
  const minutes = estimateReadingMinutes(article);
  const others = articles.filter((item) => item.id !== article.id).slice(0, 3);

  return (
    <>
      <PageHeader eyebrow={article.category} title={article.title} intro={article.excerpt}>
        <div className="flex flex-wrap items-center gap-4 text-body-sm text-emerald-100">
          {article.author ? <span>{article.author}</span> : null}
          <span>{minutes} menit baca</span>
          {/* No date is shown until the team sets a real publish date. */}
          {published ? <span>{published}</span> : null}
        </div>
      </PageHeader>

      <section className="section bg-shell">
        <div className="shell-container">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            <article className="max-w-prose">
              <Link
                to="/panduan"
                className="rounded-sm text-body-sm font-semibold text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800"
              >
                Kembali ke semua panduan
              </Link>
              {article.content.map((block, index) => (
                <Block key={`${article.id}-${index}`} block={block} />
              ))}
            </article>

            <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-lg border border-emerald-100 bg-cream p-5">
                <h2 className="text-body-lg font-semibold text-emerald-900">
                  Butuh bantuan untuk kasus Anda?
                </h2>
                <p className="mt-2 text-body-sm text-charcoal-soft">
                  Setiap berkas punya kondisi sendiri. Sampaikan situasi Anda, dan tim akan
                  menjelaskan langkah yang perlu disiapkan.
                </p>
                <ButtonLink to="/konsultasi" variant="primary" className="mt-4">
                  Konsultasikan Rencana Umrah
                </ButtonLink>
              </div>

              <div>
                <h2 className="text-label font-semibold uppercase text-charcoal-muted">
                  Panduan lain
                </h2>
                <ul className="mt-4 flex flex-col divide-y divide-emerald-100">
                  {others.map((item) => (
                    <li key={item.id} className="py-4">
                      <Tag>{item.category}</Tag>
                      <p className="mt-2">
                        <Link
                          to={`/panduan/${item.slug}`}
                          className="rounded-sm text-body font-semibold text-emerald-900 hover:text-emerald-700"
                        >
                          {item.title}
                        </Link>
                      </p>
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

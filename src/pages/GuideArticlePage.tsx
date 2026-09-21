import { Link, useParams } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Media } from "../components/ui/Media";
import { Tag } from "../components/ui/Tag";
import { articles, estimateReadingMinutes, getArticleBySlug } from "../content/articles";
import type { ArticleBlock } from "../content/types";
import { useCopy, useLang, usePick } from "../i18n/LanguageProvider";
import { chrome } from "../i18n/strings";
import type { Localized } from "../i18n/types";
import { formatDeparture } from "../lib/format";

const idCopy = {
  notFoundTitle: "Panduan ini tidak ditemukan.",
  notFoundBody:
    "Alamat yang Anda buka tidak cocok dengan panduan yang sudah diterbitkan. Daftar lengkapnya ada di halaman panduan jamaah.",
  seeAll: "Lihat semua panduan jamaah",
  minuteUnit: "menit baca",
  backToGuides: "Kembali ke semua panduan",
  helpTitle: "Butuh bantuan untuk kasus Anda?",
  helpBody:
    "Setiap berkas punya kondisi sendiri. Sampaikan situasi Anda, dan tim akan menjelaskan langkah yang perlu disiapkan.",
  otherGuides: "Panduan lain",
  note: "Catatan",
};

const enCopy: typeof idCopy = {
  notFoundTitle: "This guide was not found.",
  notFoundBody:
    "The address you opened does not match any published guide. The full list is on the pilgrim guides page.",
  seeAll: "See all pilgrim guides",
  minuteUnit: "min read",
  backToGuides: "Back to all guides",
  helpTitle: "Need help with your own case?",
  helpBody:
    "Every set of documents is different. Tell us your situation and the team will explain what to prepare.",
  otherGuides: "Other guides",
  note: "Note",
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

function Block({ block, noteLabel }: { block: ArticleBlock; noteLabel: string }) {
  if (block.kind === "heading") {
    return <h2 className="mt-10 text-display-sm text-emerald-900">{block.text}</h2>;
  }
  if (block.kind === "note") {
    return (
      <aside className="mt-8 rounded-lg border border-emerald-200 bg-cream p-5">
        <p className="text-label font-semibold uppercase text-charcoal-muted">{noteLabel}</p>
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
  const c = useCopy(copy);
  const L = usePick();
  const lang = useLang();
  const { slug } = useParams();
  const article = getArticleBySlug(articles, slug);

  if (!article) {
    return (
      <div className="section bg-shell">
        <div className="shell-container">
          <EmptyState
            title={c.notFoundTitle}
            description={c.notFoundBody}
            action={
              <ButtonLink to="/panduan" variant="primary">
                {c.seeAll}
              </ButtonLink>
            }
          />
        </div>
      </div>
    );
  }

  const published = formatDeparture(article.publishedAt, lang);
  const minutes = estimateReadingMinutes(article.content, lang);
  const others = articles.filter((item) => item.id !== article.id).slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow={L(article.category)}
        title={L(article.title)}
        intro={L(article.excerpt)}
      >
        <div className="flex flex-wrap items-center gap-4 text-body-sm text-emerald-100">
          {article.author ? <span>{L(article.author)}</span> : null}
          <span>
            {minutes} {c.minuteUnit}
          </span>
          {/* No date is shown until the team sets a real publish date. */}
          {published ? <span>{published}</span> : null}
        </div>
      </PageHeader>

      <section className="section bg-shell">
        <div className="shell-container">
          {article.thumbnail ? (
            <Media
              src={article.thumbnail}
              alt={L(article.title)}
              ratio="16/9"
              className="mb-10"
              priority
            />
          ) : null}

          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            <article className="max-w-prose">
              <Link
                to="/panduan"
                className="rounded-sm text-body-sm font-semibold text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800"
              >
                {c.backToGuides}
              </Link>
              {article.content[lang].map((block, index) => (
                <Block key={`${article.id}-${index}`} block={block} noteLabel={c.note} />
              ))}
            </article>

            <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-lg border border-emerald-100 bg-cream p-5">
                <h2 className="text-body-lg font-semibold text-emerald-900">{c.helpTitle}</h2>
                <p className="mt-2 text-body-sm text-charcoal-soft">{c.helpBody}</p>
                <ButtonLink to="/konsultasi" variant="primary" className="mt-4">
                  {chrome[lang].cta.consultPlan}
                </ButtonLink>
              </div>

              <div>
                <h2 className="text-label font-semibold uppercase text-charcoal-muted">
                  {c.otherGuides}
                </h2>
                <ul className="mt-4 flex flex-col divide-y divide-emerald-100">
                  {others.map((item) => (
                    <li key={item.id} className="py-4">
                      <Tag>{L(item.category)}</Tag>
                      <p className="mt-2">
                        <Link
                          to={`/panduan/${item.slug}`}
                          className="rounded-sm text-body font-semibold text-emerald-900 hover:text-emerald-700"
                        >
                          {L(item.title)}
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

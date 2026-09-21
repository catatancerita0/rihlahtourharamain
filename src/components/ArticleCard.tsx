import { Link } from "react-router-dom";
import { estimateReadingMinutes } from "../content/articles";
import type { Article } from "../content/types";
import { useCopy, useLang, usePick } from "../i18n/LanguageProvider";
import type { Localized } from "../i18n/types";
import { formatDeparture } from "../lib/format";
import { Media } from "./ui/Media";
import { Tag } from "./ui/Tag";

const idCopy = {
  minuteUnit: "menit baca",
  readThis: "Baca panduan ini",
};

const enCopy: typeof idCopy = {
  minuteUnit: "min read",
  readThis: "Read this guide",
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  const c = useCopy(copy);
  const L = usePick();
  const lang = useLang();
  const published = formatDeparture(article.publishedAt, lang);
  const minutes = estimateReadingMinutes(article.content, lang);

  return (
    <article
      className={`flex flex-col gap-3 rounded-lg border border-emerald-100 bg-shell p-5 sm:p-6 ${
        featured ? "lg:p-8" : ""
      }`}
    >
      {article.thumbnail ? (
        <Media
          src={article.thumbnail}
          alt={L(article.title)}
          ratio="3/2"
          className={featured ? "mb-3" : "mb-2"}
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Tag>{L(article.category)}</Tag>
        <span className="text-body-sm text-charcoal-muted">
          {minutes} {c.minuteUnit}
          {published ? ` · ${published}` : ""}
        </span>
      </div>
      <h3 className="text-display-sm text-emerald-900">
        <Link to={`/panduan/${article.slug}`} className="rounded-sm hover:text-emerald-700">
          {L(article.title)}
        </Link>
      </h3>
      <p className="max-w-prose text-body-sm text-charcoal-soft">{L(article.excerpt)}</p>
      <p className="mt-auto pt-2">
        <Link
          to={`/panduan/${article.slug}`}
          className="text-body-sm font-semibold text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800"
        >
          {c.readThis}
        </Link>
      </p>
    </article>
  );
}

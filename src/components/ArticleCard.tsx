import { Link } from "react-router-dom";
import { estimateReadingMinutes } from "../content/articles";
import type { Article } from "../content/types";
import { formatDeparture } from "../lib/format";
import { Tag } from "./ui/Tag";

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  const published = formatDeparture(article.publishedAt);
  const minutes = estimateReadingMinutes(article);

  return (
    <article
      className={`flex flex-col gap-3 rounded-lg border border-emerald-100 bg-shell p-5 sm:p-6 ${
        featured ? "lg:p-8" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Tag>{article.category}</Tag>
        <span className="text-body-sm text-charcoal-muted">
          {minutes} menit baca
          {published ? ` · ${published}` : ""}
        </span>
      </div>
      <h3 className={`text-emerald-900 ${featured ? "text-display-sm" : "text-display-sm"}`}>
        <Link to={`/panduan/${article.slug}`} className="rounded-sm hover:text-emerald-700">
          {article.title}
        </Link>
      </h3>
      <p className="max-w-prose text-body-sm text-charcoal-soft">{article.excerpt}</p>
      <p className="mt-auto pt-2">
        <Link
          to={`/panduan/${article.slug}`}
          className="text-body-sm font-semibold text-emerald-800 underline decoration-emerald-400 underline-offset-4 hover:decoration-emerald-800"
        >
          Baca panduan ini
        </Link>
      </p>
    </article>
  );
}

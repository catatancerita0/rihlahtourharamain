import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { canonicalFor, site } from "../config/site";

interface SeoProps {
  title: string;
  description?: string;
}

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

/**
 * A single page app ships one static head, so each route writes its own
 * metadata. Titles and descriptions come from the page rather than from a
 * lookup table, which stops them drifting away from the visible content.
 *
 * The canonical URL uses the configured site address instead of the current
 * origin, so a preview host never leaks into the canonical tag.
 */
export function Seo({ title, description }: SeoProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title.includes(site.brand) ? title : `${title} | ${site.brand}`;
    document.title = fullTitle;

    if (description) upsertMeta("name", "description", description);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("property", "og:title", fullTitle);

    if (description) {
      upsertMeta("name", "twitter:description", description);
      upsertMeta("property", "og:description", description);
    }

    const url = canonicalFor(pathname);
    upsertMeta("property", "og:url", url);
    upsertCanonical(url);
  }, [title, description, pathname]);

  return null;
}

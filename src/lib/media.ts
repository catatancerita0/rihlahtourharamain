/**
 * Resolving media references.
 *
 * Two mistakes here break a live site, so both are handled in one place:
 *
 *   1. GitHub Pages serves this project from /<repository>/, not from the
 *      domain root. A stored path like "/images/hero.jpg" would 404 there,
 *      while `${import.meta.env.BASE_URL}images/hero.jpg` resolves. Nothing in
 *      the content layer may be used as an img src without passing through
 *      here first.
 *   2. A path can be a leftover placeholder or a file that was never added to
 *      public/. Returning null for those lets the caller render a labelled gap
 *      instead of a broken image.
 */

const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:)?\/\//i;
const BROWSER_SCHEME = /^(?:data|blob):/i;
const PLACEHOLDER = /^\[[^\]]*\]$/;

/** Normalised once: always starts and ends with exactly one slash. */
const BASE = (() => {
  // Vite substitutes this expression at build time. The guard covers the other
  // runtime: the route verification script renders the same components under
  // Bun, where assets are still addressed from the site root.
  const raw = import.meta.env?.BASE_URL;
  const value = typeof raw === "string" && raw.trim() ? raw.trim() : "/";
  return `/${value.replace(/^\/+|\/+$/g, "")}/`.replace("//", "/");
})();

export function mediaBase(): string {
  return BASE;
}

/** A stored reference that points at another origin, so the copy does not live in this repo. */
export function isExternalReference(value: string): boolean {
  const path = value.trim();
  return EXTERNAL.test(path) || BROWSER_SCHEME.test(path);
}

/** A stored reference that should point at a file inside `public/`. */
export function isLocalAssetPath(value: string): boolean {
  const path = value.trim();
  return path.length > 0 && !isExternalReference(path) && !PLACEHOLDER.test(path);
}

/**
 * Turn a stored reference into a fetchable URL, or null when there is nothing
 * worth requesting. Callers treat null as "photo not available yet".
 */
export function assetUrl(value: string | null | undefined): string | null {
  const path = value?.trim();
  if (!path || PLACEHOLDER.test(path)) return null;
  if (isExternalReference(path)) return path;

  // A reference that climbs out of the publish folder is a mistake or a probe.
  // Refusing it keeps the site from requesting paths outside public/.
  if (path.split(/[\\/]/).includes("..")) return null;

  return `${BASE}${path.replace(/^\/+/, "")}`;
}

/**
 * Path inside `public/` for a stored reference, so a build-time check can look
 * for the file on disk. Null for external and placeholder references, which
 * have nothing to verify locally.
 */
export function publicPathOf(value: string | null | undefined): string | null {
  const path = value?.trim();
  if (!path || !isLocalAssetPath(path)) return null;
  if (path.split(/[\\/]/).includes("..")) return null;
  return path.replace(/^\/+/, "");
}

/** Every local reference a piece of content points at, for the build-time check. */
export function localReferences(values: Array<string | null | undefined>): string[] {
  return values
    .map((value) => publicPathOf(value))
    .filter((path): path is string => path !== null);
}

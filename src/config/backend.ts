/**
 * Public backend configuration.
 *
 * These two values are meant to end up inside the JavaScript bundle. Supabase
 * is built that way: the project URL and the anon key are public, and what
 * actually protects the data is row level security on the database itself. The
 * service_role key is a different thing entirely and must never appear in this
 * file or anywhere else in this repository, because it bypasses every policy.
 *
 * They are committed rather than kept in an environment file because the
 * production build runs on GitHub's runners, which cannot see this workspace's
 * environment. A value that lives only in the sandbox would leave the deployed
 * admin pointing at nothing.
 *
 * Where to find them: Supabase dashboard, Project Settings, API.
 */
export const backendConfig = {
  url: (import.meta.env?.VITE_SUPABASE_URL ?? "").trim(),
  anonKey: (import.meta.env?.VITE_SUPABASE_ANON_KEY ?? "").trim(),
};

/** Storage bucket that holds uploaded photos and licence scans. */
export const mediaBucket = "media";

const PLACEHOLDER = /^\[[^\]]*\]$/;

/**
 * True once both values are filled in. Every caller has to treat an unconfigured
 * backend as normal rather than as an error: the public pages fall back to the
 * content compiled into the site, so the site keeps working while the project
 * is still being set up.
 */
export function backendConfigured(): boolean {
  const { url, anonKey } = backendConfig;
  if (!url || !anonKey) return false;
  if (PLACEHOLDER.test(url) || PLACEHOLDER.test(anonKey)) return false;
  return url.startsWith("https://");
}

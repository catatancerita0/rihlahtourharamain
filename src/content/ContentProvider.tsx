/**
 * Holds the content bundle for the whole app.
 *
 * The provider starts from the compiled seeds, so the first paint is complete
 * and no visitor ever meets a loading skeleton for text that is already known.
 * When a backend is configured it then fetches the admin's version and swaps it
 * in. A failed fetch keeps the seeds and records the reason, which is what the
 * admin panel reports; visitors are not shown an error about a background
 * refresh they never asked for.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { backendConfigured } from "../config/backend";
import { buildBundle, seedBundle } from "../content/bundle";
import type { ParseResult } from "../content/bundle";
import type { ContentBundle } from "../content/types";

export type ContentStatus = "seed" | "loading" | "live" | "error";

export interface ContentState {
  bundle: ContentBundle;
  status: ContentStatus;
  /** Why the last fetch failed, already human-readable. Null when it did not. */
  error: string | null;
  /** Rows the backend returned that could not be read, surfaced to the admin. */
  rejected: ParseResult["rejected"];
  refresh: () => Promise<void>;
}

const ContentContext = createContext<ContentState | null>(null);

export function ContentProvider({
  children,
  initialBundle,
}: {
  children: ReactNode;
  /** Only used by the verification script, which renders an admin-edited bundle. */
  initialBundle?: ContentBundle;
}) {
  const [bundle, setBundle] = useState<ContentBundle>(initialBundle ?? seedBundle);
  const [status, setStatus] = useState<ContentStatus>(backendConfigured() ? "loading" : "seed");
  const [error, setError] = useState<string | null>(null);
  const [rejected, setRejected] = useState<ParseResult["rejected"]>([]);

  const refresh = useCallback(async () => {
    if (!backendConfigured()) {
      setStatus("seed");
      return;
    }
    setStatus((current) => (current === "live" ? current : "loading"));
    try {
      // Imported on demand: the first paint already has the compiled content, so
      // a visitor never waits for this code before seeing the page.
      const { fetchPublicContent } = await import("../lib/public-content");
      const { docs, settings } = await fetchPublicContent();
      const parsed = buildBundle(docs, settings);
      setBundle(parsed.bundle);
      setRejected(parsed.rejected);
      setError(null);
      setStatus("live");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Isi situs belum dapat dimuat.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<ContentState>(
    () => ({ bundle, status, error, rejected, refresh }),
    [bundle, status, error, rejected, refresh],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

function useContentState(): ContentState {
  const value = useContext(ContentContext);
  if (!value) {
    // Pages are always rendered under the provider. Throwing here turns a wiring
    // mistake into a clear error instead of an undefined bundle deep in a page.
    throw new Error("ContentProvider tidak ditemukan di atas komponen ini");
  }
  return value;
}

export function useContent(): ContentBundle {
  return useContentState().bundle;
}

export { useContentState };

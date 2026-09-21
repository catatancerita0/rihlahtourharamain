/**
 * Public content reads.
 *
 * These two requests go straight to the REST endpoint instead of through the
 * Supabase client. The reason is weight: the SDK is around sixty kilobytes
 * compressed, and every visitor would download it just to read text that is
 * already sitting in the compiled bundle. Only the admin panel, which needs
 * sign-in and file upload, loads the SDK.
 *
 * The anon key is the same public value either way; what protects the data is
 * row level security on the database, which applies to this endpoint exactly as
 * it does to the client library.
 */
import { backendConfig, backendConfigured } from "../config/backend";
import type { DocRow, SettingsRow } from "../content/bundle";

export interface PublicContent {
  docs: DocRow[];
  settings: SettingsRow[];
}

const DOCS_COLUMNS = "collection,slug,position,doc";
const SETTINGS_COLUMNS = "key,value";

async function readTable<T>(table: string, columns: string, order: string): Promise<T[]> {
  const response = await fetch(
    `${backendConfig.url}/rest/v1/${table}?select=${columns}&order=${order}`,
    {
      headers: {
        apikey: backendConfig.anonKey,
        Authorization: `Bearer ${backendConfig.anonKey}`,
        Accept: "application/json",
      },
      // A cached response is fine: this content changes when the admin saves,
      // and that goes through the panel, which reloads on its own.
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Isi situs belum dapat dimuat (${response.status}).`);
  }

  const data = (await response.json()) as unknown;
  if (!Array.isArray(data)) {
    throw new Error("Jawaban backend tidak berbentuk daftar.");
  }
  return data as T[];
}

export async function fetchPublicContent(): Promise<PublicContent> {
  if (!backendConfigured()) return { docs: [], settings: [] };

  const [docs, settings] = await Promise.all([
    readTable<DocRow>("content_docs", DOCS_COLUMNS, "position"),
    readTable<SettingsRow>("site_settings", SETTINGS_COLUMNS, "key"),
  ]);

  return { docs, settings };
}

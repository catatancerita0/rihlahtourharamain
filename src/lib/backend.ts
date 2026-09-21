import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { backendConfig, backendConfigured } from "../config/backend";

/**
 * One client for the whole app. `null` while the project is unconfigured, which
 * every caller has to handle: the public site then serves the content compiled
 * into the bundle, and the admin page explains what to fill in.
 */
let client: SupabaseClient | null = null;

export function getBackend(): SupabaseClient | null {
  if (!backendConfigured()) return null;
  if (client) return client;

  client = createClient(backendConfig.url, backendConfig.anonKey, {
    auth: {
      // The session is refreshed in the background and kept in local storage,
      // so the admin is not signed out on every reload. Nothing else on the
      // site reads this: visitors never authenticate.
      persistSession: true,
      autoRefreshToken: true,
      // There is no OAuth redirect to parse on this site.
      detectSessionInUrl: false,
    },
  });

  return client;
}

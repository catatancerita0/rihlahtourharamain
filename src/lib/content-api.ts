/**
 * Everything that talks to the backend.
 *
 * The admin panel is the only caller that writes. Public pages only read, and
 * they read a cache built from the compiled seeds, so a failure here degrades to
 * slightly stale content rather than to a blank site.
 *
 * Note what is deliberately absent: no service key, no server function, no
 * privileged bypass. The anon key is public, and what an admin may do is decided
 * by row level security in the database, which is why this file can be shipped
 * inside the browser bundle.
 */
import { getBackend } from "./backend";
import { mediaBucket } from "../config/backend";
import type { ContentCollection, SettingsKey } from "../content/types";
import { fetchPublicContent } from "./public-content";
import type { PublicContent } from "./public-content";

/**
 * The admin reads the same rows the public site reads. It goes through the REST
 * helper rather than the client library so the two paths cannot drift: a column
 * that one of them stops selecting would be noticed here first.
 */
export async function fetchContent(): Promise<PublicContent> {
  return fetchPublicContent();
}

export async function saveDoc(
  collection: ContentCollection,
  slug: string,
  doc: unknown,
  position: number,
): Promise<void> {
  const backend = getBackend();
  if (!backend) throw new Error("Backend belum diatur");
  const { error } = await backend
    .from("content_docs")
    .upsert(
      { collection, slug, doc, position, updated_at: new Date().toISOString() },
      { onConflict: "collection,slug" },
    );
  if (error) throw new Error(error.message);
}

export async function deleteDoc(collection: ContentCollection, slug: string): Promise<void> {
  const backend = getBackend();
  if (!backend) throw new Error("Backend belum diatur");
  const { error } = await backend
    .from("content_docs")
    .delete()
    .eq("collection", collection)
    .eq("slug", slug);
  if (error) throw new Error(error.message);
}

export async function saveSettings(key: SettingsKey, value: unknown): Promise<void> {
  const backend = getBackend();
  if (!backend) throw new Error("Backend belum diatur");
  const { error } = await backend
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw new Error(error.message);
}

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "application/pdf": "pdf",
};

/**
 * Uploads a file and returns its public URL.
 *
 * The object path is generated from a timestamp and a sanitised file name rather
 * than taken from the upload: a name supplied by a browser can contain separators
 * and would otherwise decide where in the bucket the file lands. The bucket
 * itself enforces the size limit and the allowed types, so those are not
 * re-implemented here as the only defence.
 */
export async function uploadMedia(file: File, folder: string): Promise<string> {
  const backend = getBackend();
  if (!backend) throw new Error("Backend belum diatur");

  const extension = EXTENSIONS[file.type] ?? "bin";
  const base = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  const path = `${folder}/${Date.now()}-${base || "berkas"}.${extension}`;

  const { error } = await backend.storage.from(mediaBucket).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = backend.storage.from(mediaBucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function signIn(email: string, password: string): Promise<void> {
  const backend = getBackend();
  if (!backend) throw new Error("Backend belum diatur");
  const { error } = await backend.auth.signInWithPassword({ email, password });
  // The message is passed through untranslated on purpose: Supabase returns
  // English text for a wrong password, and rewriting it here would hide which
  // side rejected the credentials.
  if (error) throw new Error(error.message);
}

export async function signOut(): Promise<void> {
  const backend = getBackend();
  if (!backend) return;
  await backend.auth.signOut();
}

export async function currentAdmin(): Promise<string | null> {
  const backend = getBackend();
  if (!backend) return null;

  const { data } = await backend.auth.getSession();
  const userId = data.session?.user.id;
  if (!userId) return null;

  // Signing in is not the same as being an admin. A valid account that is not
  // listed in the admins table gets no access, so enabling sign-ups by accident
  // does not hand anyone the content.
  const { data: rows, error } = await backend
    .from("admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !rows) return null;

  return data.session?.user.email ?? "admin";
}

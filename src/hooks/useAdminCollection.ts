/**
 * Everything the admin panel does to one collection.
 *
 * Reads come from the raw backend rows rather than from the public bundle,
 * because the panel has to show records the public site deliberately hides.
 * Writes go through one path, and each one is validated with the same decoder
 * the public site uses, so a record can never be saved in a shape the site would
 * then refuse to render.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { readDoc } from "../content/bundle";
import type { DocRow } from "../content/bundle";
import { useContentState } from "../content/ContentProvider";
import type { ContentCollection } from "../content/types";
import { HIDDEN_POSITION, mergeRecords, positionsAfterMove } from "../lib/admin-collections";
import type { AdminRecord } from "../lib/admin-collections";
import { deleteDoc, fetchContent, saveDoc } from "../lib/content-api";

export type SaveState = "idle" | "saving" | "saved" | "error";

export interface AdminCollection<T> {
  records: AdminRecord<T>[];
  unreadable: DocRow[];
  loading: boolean;
  error: string | null;
  saveState: SaveState;
  saveError: string | null;
  save: (key: string, doc: unknown, position: number) => Promise<boolean>;
  remove: (key: string) => Promise<boolean>;
  move: (key: string, direction: -1 | 1) => Promise<void>;
  setHidden: (key: string, hidden: boolean) => Promise<void>;
  reload: () => Promise<void>;
}

export function useAdminCollection<T extends object>(
  collection: ContentCollection,
): AdminCollection<T> {
  const { refresh } = useContentState();
  const [rows, setRows] = useState<DocRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const { docs } = await fetchContent();
      setRows(docs);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Daftar isi tidak dapat dimuat.");
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const merged = useMemo(
    () => (rows ? mergeRecords<T>(collection, rows) : { records: [], unreadable: [] }),
    [rows, collection],
  );

  const write = useCallback(
    async (key: string, doc: unknown, position: number): Promise<boolean> => {
      setSaveState("saving");
      setSaveError(null);
      try {
        const parsed = readDoc(collection, doc);
        if (parsed === null) {
          setSaveState("error");
          setSaveError("Isi catatan belum lengkap, jadi belum disimpan.");
          return false;
        }
        await saveDoc(collection, key, parsed, position);
        await reload();
        // The public bundle is refreshed too, so a change is visible on the site
        // without a reload of the page.
        await refresh();
        setSaveState("saved");
        return true;
      } catch (cause) {
        setSaveState("error");
        setSaveError(cause instanceof Error ? cause.message : "Penyimpanan gagal.");
        return false;
      }
    },
    [collection, refresh, reload],
  );

  const remove = useCallback(
    async (key: string): Promise<boolean> => {
      setSaveState("saving");
      setSaveError(null);
      try {
        await deleteDoc(collection, key);
        await reload();
        await refresh();
        setSaveState("saved");
        return true;
      } catch (cause) {
        setSaveState("error");
        setSaveError(cause instanceof Error ? cause.message : "Penghapusan gagal.");
        return false;
      }
    },
    [collection, refresh, reload],
  );

  const move = useCallback(
    async (key: string, direction: -1 | 1) => {
      const order = positionsAfterMove(merged.records, key, direction);
      if (order.length === 0) return;
      for (const entry of order) {
        const record = merged.records.find((item) => item.key === entry.key);
        if (!record) continue;
        // Reordering must not bring a hidden record back to the site, so a
        // hidden record is written again with the hidden position.
        const position = record.hidden ? HIDDEN_POSITION : entry.position;
        await write(entry.key, record.doc, position);
      }
    },
    [merged.records, write],
  );

  const setHidden = useCallback(
    async (key: string, hidden: boolean) => {
      const index = merged.records.findIndex((record) => record.key === key);
      const record = merged.records[index];
      if (!record) return;
      await write(key, record.doc, hidden ? HIDDEN_POSITION : index);
    },
    [merged.records, write],
  );

  return {
    records: merged.records,
    unreadable: merged.unreadable,
    loading: rows === null && error === null,
    error,
    saveState,
    saveError,
    save: write,
    remove,
    move,
    setHidden,
    reload,
  };
}

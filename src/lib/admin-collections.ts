/**
 * The admin sees a list that is neither the seeds nor the backend rows, but the
 * two combined: every compiled record with whatever the backend overrides on
 * top, plus records the admin added.
 *
 * This matters for two reasons. A record that has never been edited still has a
 * form to open, and a record that was hidden is still listed, because a row with
 * a negative position is removed from the public site but has to stay visible in
 * the panel or nobody could bring it back.
 */
import { collectionSeed, isContentCollection, keyFieldOf, readDoc } from "../content/bundle";
import type { DocRow } from "../content/bundle";
import type { ContentCollection } from "../content/types";

/** Position used for a record the admin has taken off the public site. */
export const HIDDEN_POSITION = -1;

export interface AdminRecord<T> {
  key: string;
  doc: T;
  /** True when the backend row exists but is marked hidden. */
  hidden: boolean;
  /** Ordering value; hidden records keep the position they had. */
  position: number;
  /** False for records the admin created, which can be deleted outright. */
  fromSeed: boolean;
  /** True when a backend row exists, whether or not it changes anything. */
  saved: boolean;
}

export interface MergeResult<T> {
  records: AdminRecord<T>[];
  /** Backend rows that no decoder could read. Shown, because they are a mistake. */
  unreadable: DocRow[];
}

export function mergeRecords<T extends object>(
  collection: ContentCollection,
  rows: DocRow[],
): MergeResult<T> {
  const keyField = keyFieldOf(collection);
  const seeds = collectionSeed<T>(collection);
  const byKey = new Map<string, DocRow>();

  const unreadable: DocRow[] = [];
  for (const row of rows) {
    if (row.collection !== collection) continue;
    if (!isContentCollection(row.collection) || readDoc(collection, row.doc) === null) {
      unreadable.push(row);
      continue;
    }
    byKey.set(row.slug, row);
  }

  const keyOf = (doc: T): string => {
    const value = (doc as Record<string, unknown>)[keyField];
    return typeof value === "string" ? value : "";
  };

  const records: AdminRecord<T>[] = seeds.map((seed, index) => {
    const key = keyOf(seed);
    const row = byKey.get(key);
    return {
      key,
      doc: row ? (readDoc(collection, row.doc) as T) : seed,
      hidden: row ? row.position < 0 : false,
      position: row && row.position >= 0 ? row.position : index,
      fromSeed: true,
      saved: row !== undefined,
    };
  });

  const known = new Set(records.map((record) => record.key));
  for (const [key, row] of byKey) {
    if (known.has(key)) continue;
    records.push({
      key,
      doc: readDoc(collection, row.doc) as T,
      hidden: row.position < 0,
      position: row.position,
      fromSeed: false,
      saved: true,
    });
  }

  records.sort((a, b) => a.position - b.position);
  return { records, unreadable };
}

/**
 * Positions are rewritten from the current order after every change, because
 * gaps left behind by a delete would otherwise make the next reorder behave
 * unpredictably.
 */
export function positionsAfterMove<T>(
  records: AdminRecord<T>[],
  key: string,
  direction: -1 | 1,
): Array<{ key: string; position: number }> {
  const order = records.map((record) => record.key);
  const index = order.indexOf(key);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= order.length) return [];

  const swap = order[index];
  order[index] = order[target];
  order[target] = swap;

  return order.map((entry, position) => ({ key: entry, position }));
}

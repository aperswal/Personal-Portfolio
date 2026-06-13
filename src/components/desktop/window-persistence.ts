import { z } from "zod";
import type { PersistStorage, StorageValue } from "zustand/middleware";
import type { WindowState } from "./types";

/**
 * Persistence boundary for the window manager.
 *
 * The store keeps `windows` as a Map in memory, but we persist it as a plain
 * `WindowState[]` so the on-disk shape is ordinary JSON — no custom Map codec,
 * no reviver. Untrusted localStorage data is Zod-validated on the way back in
 * and we fail closed (return null -> store falls back to its initial state)
 * rather than letting a corrupt blob crash the desktop.
 */

/** localStorage key + schema version (bump to discard incompatible blobs). */
export const PERSIST_NAME = "portfolio:windows";
export const PERSIST_VERSION = 1;

/** Largest plausible window edge; anything bigger is treated as corruption. */
const MAX_DIMENSION = 20_000;

const finiteNumber = z.number().refine((n) => Number.isFinite(n), {
  message: "must be a finite number",
});

const dimension = z
  .number()
  .refine((n) => Number.isFinite(n) && n > 0 && n <= MAX_DIMENSION, {
    message: "must be a positive, finite, in-range dimension",
  });

const positionSchema = z.object({ x: finiteNumber, y: finiteNumber });
const sizeSchema = z.object({ width: dimension, height: dimension });

const windowStateSchema = z.object({
  id: z.string().min(1),
  isMinimized: z.boolean(),
  isMaximized: z.boolean(),
  position: positionSchema,
  size: sizeSchema,
  preMaximize: z.object({ position: positionSchema, size: sizeSchema }).nullable(),
});

/** Far above the ~12 registered apps; bounds a tampered/huge blob (DoS guard). */
const MAX_WINDOWS = 64;

const persistedStateSchema = z.object({
  windows: z.array(windowStateSchema).max(MAX_WINDOWS),
  windowOrder: z.array(z.string()).max(MAX_WINDOWS),
});

/** The persisted subset of the store (plain JSON). */
export type PersistedWindows = z.infer<typeof persistedStateSchema>;

/** In-memory shape the store consumes after validation. */
export interface RestoredWindows {
  windows: Map<string, WindowState>;
  windowOrder: string[];
}

/** Flatten the in-memory Map into the persisted array form. */
export function serializeWindows(windows: Map<string, WindowState>): WindowState[] {
  return Array.from(windows.values());
}

/**
 * Validate untrusted persisted data and rebuild the Map. Returns null on any
 * schema failure so the store falls back to its initial (empty) state. Also
 * repairs windows<->order desync: only ids present in BOTH survive, in order.
 */
export function sanitizePersisted(raw: unknown): RestoredWindows | null {
  const parsed = persistedStateSchema.safeParse(raw);
  if (!parsed.success) return null;

  const byId = new Map<string, WindowState>();
  for (const win of parsed.data.windows) byId.set(win.id, win);

  const seen = new Set<string>();
  const windowOrder: string[] = [];
  const windows = new Map<string, WindowState>();
  for (const id of parsed.data.windowOrder) {
    if (!byId.has(id) || seen.has(id)) continue;
    seen.add(id);
    windowOrder.push(id);
    windows.set(id, byId.get(id)!);
  }

  return { windows, windowOrder };
}

const DEFAULT_DEBOUNCE_MS = 200;

/** A PersistStorage whose pending write can be forced out immediately. */
export interface FlushableStorage extends PersistStorage<PersistedWindows> {
  flush: () => void;
}

/** Read localStorage defensively: undefined on SSR, disabled, or sandboxed. */
function getLocalStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * A localStorage-backed PersistStorage for the window store. It owns JSON
 * encoding directly (rather than via createJSONStorage) so a malformed/tampered
 * blob is caught here and yields null — it can never reach rehydrate() as a
 * thrown error. Writes are debounced (so dragging a window doesn't thrash
 * synchronous writes ~60x/sec) and flush() forces the pending write out before
 * the tab is hidden/closed. Every access is wrapped so a disabled / quota /
 * SSR environment degrades to null instead of throwing.
 */
export function createWindowStorage(debounceMs = DEFAULT_DEBOUNCE_MS): FlushableStorage {
  let timer: ReturnType<typeof setTimeout> | null = null;
  // Hold the raw value (not a pre-stringified string) so serialization happens
  // once per debounce window in writeNow — not once per drag frame in setItem.
  let pending: { name: string; value: StorageValue<PersistedWindows> } | null = null;
  // Last serialized payload actually written; skip identical re-writes (e.g. a
  // viewport-only state change re-serializes the same {windows, windowOrder}).
  let lastWritten: string | null = null;

  const writeNow = (): void => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (!pending) return;
    const { name, value } = pending;
    pending = null;
    let serialized: string;
    try {
      serialized = JSON.stringify(value);
    } catch {
      return; // non-serializable value — skip rather than throw
    }
    if (serialized === lastWritten) return;
    lastWritten = serialized;
    try {
      getLocalStorage()?.setItem(name, serialized);
    } catch {
      // quota exceeded / disabled storage — drop the write, never throw
    }
  };

  return {
    getItem: (name) => {
      try {
        const raw = getLocalStorage()?.getItem(name);
        if (raw == null) return null;
        const parsed: unknown = JSON.parse(raw);
        if (typeof parsed !== "object" || parsed === null) return null;
        return parsed as StorageValue<PersistedWindows>;
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      pending = { name, value };
      if (timer) clearTimeout(timer);
      timer = setTimeout(writeNow, debounceMs);
    },
    removeItem: (name) => {
      pending = null;
      lastWritten = null;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      try {
        getLocalStorage()?.removeItem(name);
      } catch {
        // ignore
      }
    },
    flush: writeNow,
  };
}

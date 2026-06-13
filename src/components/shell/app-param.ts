import { z } from "zod";
import { APP_IDS } from "@/data/apps";

/**
 * The `?app=` URL parameter is untrusted input, so it is validated at the
 * boundary against the real app registry. Hidden ids are intentionally allowed
 * so Media-folder sub-apps (e.g. "movies") remain deep-linkable; anything that
 * is not a registered app id fails closed to null.
 */
const APP_ID_VALUES = Object.values(APP_IDS) as [string, ...string[]];

export const appParamSchema = z.enum(APP_ID_VALUES);

export function parseAppParam(raw: string | null): string | null {
  const result = appParamSchema.safeParse(raw);
  return result.success ? result.data : null;
}

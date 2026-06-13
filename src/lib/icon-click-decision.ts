export type IconClickDecision = "select" | "open";

export interface IconClick {
  id: string;
  time: number;
}

/** A second click on the same icon within this window counts as a double-click. */
export const DOUBLE_CLICK_MS = 400;

/**
 * Decide whether a click on a desktop icon should select it or open it.
 *
 * Opens only when the previous click was on the same icon and arrived within
 * the threshold; every other case (no prior click, different icon, too slow)
 * is a plain selection.
 */
export function decideIconClick(
  previous: IconClick | null,
  current: IconClick,
  thresholdMs = DOUBLE_CLICK_MS,
): IconClickDecision {
  if (
    previous !== null &&
    previous.id === current.id &&
    current.time - previous.time <= thresholdMs
  ) {
    return "open";
  }
  return "select";
}

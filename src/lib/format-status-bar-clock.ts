/**
 * Formats a Date as an iOS-style 12-hour status-bar clock: "h:mm".
 *
 * The hour has no leading zero (1-12) and midnight/noon both read "12"; minutes
 * are always zero-padded to two digits. No AM/PM suffix — the iOS status bar
 * shows only the time.
 */
export function formatStatusBarClock(date: Date): string {
  const hours24 = date.getHours();
  const hour12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hour12}:${minutes}`;
}

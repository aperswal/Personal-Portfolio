"use client";

import { useEffect, useState } from "react";
import { SignalHigh, Wifi, BatteryFull } from "lucide-react";
import { formatStatusBarClock } from "@/lib/format-status-bar-clock";

/** Milliseconds remaining until the start of the next clock minute. */
function msUntilNextMinute(now: Date): number {
  return 60_000 - (now.getSeconds() * 1_000 + now.getMilliseconds());
}

/**
 * Fixed iOS status bar: live clock on the left, static connectivity glyphs on
 * the right. The clock re-renders on a timer aligned to the next minute (not a
 * blind 60s interval) so it flips exactly when the minute changes. There is no
 * Battery API — the battery glyph is decorative, matching the iOS chrome.
 */
/**
 * `tone` adapts the text/glyph color to whatever surface the bar sits over:
 * `light` (white) reads on the dark home wallpaper, `dark` reads on a light app
 * view. This mirrors iOS, which flips the status-bar style per foreground app.
 */
export function StatusBar({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const scheduleNextTick = () => {
      timeoutId = setTimeout(() => {
        setNow(new Date());
        scheduleNextTick();
      }, msUntilNextMinute(new Date()));
    };
    scheduleNextTick();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 pb-1 ${
        tone === "dark" ? "text-deep-brown" : "text-white"
      }`}
      style={{ paddingTop: "max(env(safe-area-inset-top), 0.75rem)" }}
      aria-hidden="true"
      data-testid="status-bar"
    >
      <span className="text-sm font-semibold tabular-nums">
        {formatStatusBarClock(now)}
      </span>
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <SignalHigh size={16} strokeWidth={2.5} />
        <Wifi size={16} strokeWidth={2.5} />
        <BatteryFull size={20} strokeWidth={2} />
      </div>
    </div>
  );
}

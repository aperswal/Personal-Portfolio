"use client";

import { RotateCcw } from "lucide-react";
import { useViewportSize } from "@/lib/use-viewport-size";

/**
 * Hard-blocks portrait mode on small screens.
 * Auto-dismisses when user rotates to landscape — no dismiss button.
 */
export function OrientationNotice() {
  const { width, height } = useViewportSize();

  // SSR: width/height are 0 during server render, don't block
  if (width === 0 || width >= 1024 || height <= width) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-parchment/95 p-lg backdrop-blur-sm">
      <div className="flex max-w-sm flex-col items-center gap-lg text-center">
        <RotateCcw
          size={48}
          strokeWidth={1}
          className="text-amber animate-[spin_3s_ease-in-out_infinite]"
        />
        <h2 className="font-display text-2xl text-obsidian">Try Landscape Mode</h2>
        <p className="font-body text-sm leading-relaxed text-warm-gray">
          This portfolio is a desktop experience. For the best view, rotate your phone or
          tablet sideways.
        </p>
      </div>
    </div>
  );
}

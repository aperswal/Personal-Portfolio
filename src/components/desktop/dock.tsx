"use client";

import { useState } from "react";
import { Layers } from "lucide-react";
import { useWindowManager } from "./window-manager";
import { useViewportSize } from "@/lib/use-viewport-size";
import type { AppDefinition } from "./types";
import { cn, ICON_CONTAINER_BASE } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DockProps {
  apps: AppDefinition[];
}

export function Dock({ apps }: DockProps) {
  const visibleApps = apps.filter((a) => !a.hidden);
  const { state, openWindow, restoreWindow, isWindowOpen } = useWindowManager();
  const { width: vw } = useViewportSize();
  const [stackOpen, setStackOpen] = useState(false);

  const compact = vw > 0 && vw < 700;
  const iconSize = compact ? "h-9 w-9" : "h-12 w-12";
  const iconText = compact ? "text-base" : "text-xl";
  const dockPadding = compact ? "px-2 py-1.5" : "px-3 py-2";
  const dockGap = compact ? "gap-0.5" : "gap-1";
  const maxVisibleMinimized = compact ? 2 : 4;

  const appsById = new Map(apps.map((a) => [a.id, a]));

  const minimizedWindows = Array.from(state.windows.values()).filter(
    (w) => w.isMinimized,
  );

  const visibleMinimized = minimizedWindows.slice(0, maxVisibleMinimized);
  const overflowMinimized = minimizedWindows.slice(maxVisibleMinimized);
  const hasOverflow = overflowMinimized.length > 0;

  return (
    <nav
      aria-label="Application dock"
      className={cn(
        "fixed bottom-3 left-1/2 z-[9999] flex -translate-x-1/2 items-end overflow-x-auto rounded-2xl border border-deep-brown/10 bg-parchment/70 shadow-lg backdrop-blur-xl",
        dockPadding,
        dockGap,
      )}
    >
      {/* App icons */}
      {visibleApps.map((app) => {
        const isMinimized = state.windows.get(app.id)?.isMinimized ?? false;
        const isOpen = isWindowOpen(app.id);

        return (
          <Tooltip key={app.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  if (isMinimized) {
                    restoreWindow(app.id);
                  } else {
                    openWindow(app.id, app.defaultSize);
                  }
                }}
                aria-label={`Open ${app.title}`}
                className={cn(
                  "group relative flex items-center justify-center rounded-xl transition-all duration-200",
                  "hover:-translate-y-1 hover:scale-110",
                  ICON_CONTAINER_BASE,
                  "active:scale-95",
                  iconSize,
                )}
              >
                <span className={iconText}>{app.icon}</span>

                {/* Open indicator dot */}
                {(isOpen || isMinimized) && (
                  <span
                    className={cn(
                      "absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full",
                      isMinimized ? "bg-warm-gray/40" : "bg-amber",
                    )}
                  />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="border-deep-brown/10 bg-parchment text-deep-brown"
            >
              {app.title}
            </TooltipContent>
          </Tooltip>
        );
      })}

      {/* Separator + minimized window thumbnails */}
      {minimizedWindows.length > 0 && (
        <>
          <div className="mx-1 h-10 w-px bg-deep-brown/10" />

          {visibleMinimized.map((win) => {
            const app = appsById.get(win.id);
            if (!app) return null;
            return (
              <Tooltip key={`min-${win.id}`}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => restoreWindow(win.id)}
                    aria-label={`Restore ${app.title}`}
                    className={cn(
                      "relative flex items-center justify-center rounded-xl transition-all duration-200",
                      "hover:-translate-y-1 hover:scale-110",
                      "bg-cream/50 border border-dashed border-deep-brown/15 text-warm-gray shadow-sm",
                      "active:scale-95",
                      iconSize,
                    )}
                  >
                    <span className={cn(iconText, "opacity-50")}>{app.icon}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="border-deep-brown/10 bg-parchment text-deep-brown"
                >
                  {app.title} (minimized)
                </TooltipContent>
              </Tooltip>
            );
          })}

          {/* Overflow stack */}
          {hasOverflow && (
            <div className="relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setStackOpen(!stackOpen)}
                    aria-label={`${overflowMinimized.length} more minimized windows`}
                    className={cn(
                      "relative flex items-center justify-center rounded-xl transition-all duration-200",
                      "hover:-translate-y-1 hover:scale-110",
                      "bg-cream/50 border border-dashed border-deep-brown/15 text-warm-gray shadow-sm",
                      "active:scale-95",
                      iconSize,
                    )}
                  >
                    <Layers size={compact ? 14 : 18} strokeWidth={1.5} />
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber text-[10px] font-medium text-white">
                      {overflowMinimized.length}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="border-deep-brown/10 bg-parchment text-deep-brown"
                >
                  {overflowMinimized.length} more windows
                </TooltipContent>
              </Tooltip>

              {/* Stack popup */}
              {stackOpen && (
                <div className="absolute bottom-full right-0 mb-2 flex max-h-64 flex-col gap-1 overflow-y-auto rounded-xl border border-deep-brown/10 bg-parchment/90 p-2 shadow-xl backdrop-blur-xl">
                  {overflowMinimized.map((win) => {
                    const app = appsById.get(win.id);
                    if (!app) return null;
                    return (
                      <button
                        key={win.id}
                        onClick={() => {
                          restoreWindow(win.id);
                          setStackOpen(false);
                        }}
                        className="flex items-center gap-md rounded-lg px-md py-sm text-left transition-colors hover:bg-cream"
                      >
                        <span className="text-lg opacity-60">{app.icon}</span>
                        <span className="text-xs font-medium text-deep-brown">
                          {app.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </nav>
  );
}

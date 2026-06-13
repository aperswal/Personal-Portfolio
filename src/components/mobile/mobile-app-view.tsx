"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import { setReturnFocusAppId } from "./focus-handoff";
import { useAppNavigation } from "@/components/shell/app-navigation";
import { AppContent } from "@/components/desktop/app-content";
import type { AppDefinition } from "@/components/desktop/types";

/**
 * Full-screen iOS app view: the status bar, a labelled back affordance that
 * returns to the home grid, and the shared AppContent (which carries the single
 * WindowErrorBoundary). Content scrolls beneath the fixed chrome with safe-area
 * insets so nothing hides under the notch or the home indicator.
 */
export function MobileAppView({ app }: { app: AppDefinition }) {
  const { closeApp } = useAppNavigation();
  const backRef = useRef<HTMLButtonElement>(null);

  // Move focus into the newly-opened app so keyboard/screen-reader focus does
  // not fall to <body> after the soft navigation unmounts the home grid, and
  // record this app so the grid restores focus to its icon on Back.
  useEffect(() => {
    backRef.current?.focus();
    setReturnFocusAppId(app.id);
  }, [app.id]);

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-cream">
      <header
        className="flex shrink-0 items-center border-b border-deep-brown/8 bg-parchment px-2"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 2.25rem)",
          paddingBottom: "0.5rem",
        }}
      >
        <button
          type="button"
          ref={backRef}
          onClick={() => closeApp()}
          aria-label="Back to home"
          className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-deep-brown focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
        >
          <ChevronLeft size={20} strokeWidth={2} />
          Home
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 truncate font-display text-sm font-medium text-warm-gray">
          {app.title}
        </span>
      </header>
      <main
        className="flex-1 overflow-auto"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <AppContent app={app} />
      </main>
    </div>
  );
}

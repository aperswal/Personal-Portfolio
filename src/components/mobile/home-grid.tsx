"use client";

import { useEffect, useRef } from "react";
import { useAppNavigation } from "@/components/shell/app-navigation";
import { consumeReturnFocusAppId } from "./focus-handoff";
import { WALLPAPER_MOBILE_LANDSCAPE, WALLPAPER_MOBILE_PORTRAIT } from "@/data/wallpapers";
import type { AppDefinition } from "@/components/desktop/types";

/**
 * iOS home screen: a grid of the non-hidden apps over the Blob wallpaper
 * (portrait vs landscape swapped purely by CSS orientation variants).
 * A single tap opens the app through the navigation seam (URL-driven on mobile).
 * Hidden apps (Media sub-apps) are reachable only via deep links, never here.
 *
 * On mount it restores focus to the icon of the app the user just came back
 * from (if any) so keyboard/screen-reader focus is not lost on return.
 */
export function HomeGrid({ apps }: { apps: AppDefinition[] }) {
  const { openApp } = useAppNavigation();
  const visibleApps = apps.filter((app) => !app.hidden);
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    const id = consumeReturnFocusAppId();
    if (id) buttonRefs.current.get(id)?.focus();
  }, []);

  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      {/* Orientation-aware Blob wallpaper, swapped by pure CSS variants. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-cover bg-center bg-no-repeat portrait:block"
        style={{ backgroundImage: `url('${WALLPAPER_MOBILE_PORTRAIT}')` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-cover bg-center bg-no-repeat landscape:block"
        style={{ backgroundImage: `url('${WALLPAPER_MOBILE_LANDSCAPE}')` }}
      />
      <div
        className="relative grid grid-cols-4 gap-x-4 gap-y-6 px-6"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 4rem)",
          paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)",
        }}
      >
        {visibleApps.map((app) => (
          <button
            key={app.id}
            type="button"
            ref={(el) => {
              if (el) buttonRefs.current.set(app.id, el);
              else buttonRefs.current.delete(app.id);
            }}
            onClick={() => openApp(app.id)}
            aria-label={`Open ${app.title}`}
            className="flex min-h-16 flex-col items-center gap-1.5 rounded-2xl p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/85 text-deep-brown shadow-md backdrop-blur-sm">
              {app.icon}
            </span>
            <span className="line-clamp-2 text-center text-[11px] font-medium leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {app.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

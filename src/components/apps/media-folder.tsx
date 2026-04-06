"use client";

import { useWindowManager } from "@/components/desktop/window-manager";
import { APP_IDS, appMeta } from "@/data/apps";

const MEDIA_APP_IDS = [
  APP_IDS.MOVIES,
  APP_IDS.BOOKS,
  APP_IDS.MUSIC,
  APP_IDS.GALLERY,
  APP_IDS.YOUTUBE,
  APP_IDS.NEWSLETTERS,
  APP_IDS.PODCASTS,
] as const;

export function MediaFolderContent() {
  const { openWindow } = useWindowManager();

  return (
    <div className="h-full overflow-auto p-lg">
      <div className="grid grid-cols-4 gap-md">
        {MEDIA_APP_IDS.map((id) => {
          const meta = appMeta[id];
          return (
            <button
              key={id}
              onClick={() => openWindow(id, meta.defaultSize)}
              className="flex flex-col items-center gap-1.5 rounded-lg p-md transition-colors hover:bg-deep-brown/5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-deep-brown/8 bg-cream/80 text-deep-brown shadow-sm">
                {meta.icon}
              </span>
              <span className="text-center text-[11px] font-medium leading-tight text-deep-brown/80">
                {meta.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

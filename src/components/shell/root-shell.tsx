"use client";

import { Suspense } from "react";
import { Desktop } from "@/components/desktop/desktop";
import { MobileShell } from "@/components/mobile/mobile-shell";
import { useIsMobileDevice } from "@/lib/use-is-mobile-device";
import type { AppDefinition } from "@/components/desktop/types";

interface RootShellProps {
  apps: AppDefinition[];
  initialAppId?: string;
}

/**
 * The single top-level presentation branch. Because the device gate's
 * getServerSnapshot returns false, the server and the first client paint always
 * render Desktop — no separate mounted flag is needed and there is no hydration
 * mismatch. The mobile subtree (which reads useSearchParams) is the only thing
 * wrapped in Suspense, keeping the desktop static render untouched.
 */
export function RootShell({ apps, initialAppId }: RootShellProps) {
  const isMobileDevice = useIsMobileDevice();

  if (!isMobileDevice) {
    return <Desktop apps={apps} initialAppId={initialAppId} />;
  }

  return (
    <Suspense fallback={null}>
      <MobileShell apps={apps} />
    </Suspense>
  );
}

"use client";

import { WindowErrorBoundary } from "./error-boundary";
import type { AppDefinition } from "./types";

interface AppContentProps {
  app: AppDefinition;
}

export function AppContent({ app }: AppContentProps) {
  return <WindowErrorBoundary appTitle={app.title}>{app.content}</WindowErrorBoundary>;
}

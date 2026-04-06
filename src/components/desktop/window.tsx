"use client";

import { useCallback, useRef, type PointerEvent } from "react";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWindowManager } from "./window-manager";
import { useViewportSize } from "@/lib/use-viewport-size";
import { WindowErrorBoundary } from "./error-boundary";
import type { AppDefinition } from "./types";

type ResizeEdge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const CURSOR_MAP: Record<ResizeEdge, string> = {
  n: "cursor-n-resize",
  s: "cursor-s-resize",
  e: "cursor-e-resize",
  w: "cursor-w-resize",
  ne: "cursor-ne-resize",
  nw: "cursor-nw-resize",
  se: "cursor-se-resize",
  sw: "cursor-sw-resize",
};

interface DesktopWindowProps {
  app: AppDefinition;
  zIndex: number;
}

export function DesktopWindow({ app, zIndex }: DesktopWindowProps) {
  const {
    state,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    bringToFront,
    updatePosition,
    updateSize,
  } = useWindowManager();

  const { width: vw, height: vh } = useViewportSize();
  const MIN_WIDTH = Math.min(320, vw > 0 ? vw - 20 : 320);
  const MIN_HEIGHT = Math.min(200, vh > 0 ? vh - 60 : 200);

  const win = state.windows.get(app.id);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const resizeRef = useRef<{
    edge: ResizeEdge;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    originW: number;
    originH: number;
  } | null>(null);

  const windowRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback(() => {
    bringToFront(app.id);
  }, [app.id, bringToFront]);

  // --- Drag ---

  const handleTitleBarPointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!win || win.isMaximized) return;
      e.preventDefault();
      bringToFront(app.id);

      const el = windowRef.current;
      if (!el) return;

      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        originX: win.position.x,
        originY: win.position.y,
      };

      el.setPointerCapture(e.pointerId);
    },
    [app.id, win, bringToFront],
  );

  // --- Resize ---

  const handleResizePointerDown = useCallback(
    (edge: ResizeEdge, e: PointerEvent<HTMLDivElement>) => {
      if (!win || win.isMaximized) return;
      e.preventDefault();
      e.stopPropagation();
      bringToFront(app.id);

      resizeRef.current = {
        edge,
        startX: e.clientX,
        startY: e.clientY,
        originX: win.position.x,
        originY: win.position.y,
        originW: win.size.width,
        originH: win.size.height,
      };

      const el = windowRef.current;
      if (el) el.setPointerCapture(e.pointerId);
    },
    [app.id, win, bringToFront],
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      // Resize takes priority
      if (resizeRef.current) {
        const r = resizeRef.current;
        const dx = e.clientX - r.startX;
        const dy = e.clientY - r.startY;

        let newX = r.originX;
        let newY = r.originY;
        let newW = r.originW;
        let newH = r.originH;

        if (r.edge.includes("e")) newW = Math.max(MIN_WIDTH, r.originW + dx);
        if (r.edge.includes("s")) newH = Math.max(MIN_HEIGHT, r.originH + dy);

        if (r.edge.includes("w")) {
          const dw = Math.min(dx, r.originW - MIN_WIDTH);
          newW = r.originW - dw;
          newX = r.originX + dw;
        }
        if (r.edge.includes("n")) {
          const dh = Math.min(dy, r.originH - MIN_HEIGHT);
          newH = r.originH - dh;
          newY = r.originY + dh;
        }

        updateSize(app.id, { width: newW, height: newH }, { x: newX, y: newY });
        return;
      }

      // Drag — clamp so at least 100px stays on-screen horizontally, title bar stays visible vertically
      if (dragRef.current) {
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        let newX = dragRef.current.originX + dx;
        let newY = dragRef.current.originY + dy;

        if (vw > 0 && win) {
          newX = Math.max(-(win.size.width - 100), Math.min(newX, vw - 100));
          newY = Math.max(0, Math.min(newY, vh - 40));
        }

        updatePosition(app.id, { x: newX, y: newY });
      }
    },
    [app.id, vw, vh, MIN_WIDTH, MIN_HEIGHT, win, updatePosition, updateSize],
  );

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
    resizeRef.current = null;
  }, []);

  if (!win || win.isMinimized) return null;

  const style = win.isMaximized
    ? { zIndex }
    : {
        left: win.position.x,
        top: win.position.y,
        width: win.size.width,
        height: win.size.height,
        zIndex,
      };

  return (
    <div
      ref={windowRef}
      role="dialog"
      aria-label={app.title}
      className={cn(
        "flex flex-col overflow-hidden border border-deep-brown/15 bg-cream shadow-xl",
        win.isMaximized ? "fixed inset-0 z-[10000] !rounded-none" : "absolute rounded-lg",
      )}
      style={style}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Resize handles — hidden when maximized */}
      {!win.isMaximized && (
        <>
          {(["n", "s", "e", "w", "ne", "nw", "se", "sw"] as ResizeEdge[]).map((edge) => (
            <div
              key={edge}
              className={cn(
                "absolute z-10",
                CURSOR_MAP[edge],
                // Edge strips
                edge === "n" && "left-2 right-2 top-0 h-1",
                edge === "s" && "bottom-0 left-2 right-2 h-1",
                edge === "e" && "bottom-2 right-0 top-2 w-1",
                edge === "w" && "bottom-2 left-0 top-2 w-1",
                // Corner squares
                edge === "nw" && "left-0 top-0 h-2 w-2",
                edge === "ne" && "right-0 top-0 h-2 w-2",
                edge === "sw" && "bottom-0 left-0 h-2 w-2",
                edge === "se" && "bottom-0 right-0 h-2 w-2",
              )}
              onPointerDown={(e) => handleResizePointerDown(edge, e)}
            />
          ))}
        </>
      )}

      {/* Title bar */}
      <header
        className="flex h-10 shrink-0 cursor-grab items-center justify-between border-b border-deep-brown/8 bg-parchment px-md select-none active:cursor-grabbing"
        onPointerDown={handleTitleBarPointerDown}
      >
        {/* Traffic light buttons */}
        <div
          className="group/lights flex items-center gap-[6px]"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => closeWindow(app.id)}
            aria-label={`Close ${app.title}`}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-error transition-opacity hover:opacity-80"
          >
            <X
              size={8}
              strokeWidth={2.5}
              className="text-traffic-close opacity-0 transition-opacity group-hover/lights:opacity-100"
            />
          </button>
          <button
            onClick={() => minimizeWindow(app.id)}
            aria-label={`Minimize ${app.title}`}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-warning transition-opacity hover:opacity-80"
          >
            <Minus
              size={8}
              strokeWidth={2.5}
              className="text-traffic-minimize opacity-0 transition-opacity group-hover/lights:opacity-100"
            />
          </button>
          <button
            onClick={() => maximizeWindow(app.id)}
            aria-label={`${win.isMaximized ? "Restore" : "Maximize"} ${app.title}`}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-success transition-opacity hover:opacity-80"
          >
            {win.isMaximized ? (
              <Minimize2
                size={7}
                strokeWidth={2.5}
                className="text-traffic-maximize opacity-0 transition-opacity group-hover/lights:opacity-100"
              />
            ) : (
              <Maximize2
                size={7}
                strokeWidth={2.5}
                className="text-traffic-maximize opacity-0 transition-opacity group-hover/lights:opacity-100"
              />
            )}
          </button>
        </div>

        <span className="absolute left-1/2 max-w-[calc(100%-120px)] -translate-x-1/2 truncate font-display text-sm font-medium text-warm-gray">
          {app.title}
        </span>

        <div className="w-12" />
      </header>

      {/* Window content */}
      <div className="flex-1 overflow-auto">
        <WindowErrorBoundary appTitle={app.title}>{app.content}</WindowErrorBoundary>
      </div>
    </div>
  );
}

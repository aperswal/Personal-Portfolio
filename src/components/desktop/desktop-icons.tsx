"use client";

import { useState, useCallback, useRef, useMemo, type PointerEvent } from "react";
import { useWindowManager } from "./window-manager";
import { useViewportSize } from "@/lib/use-viewport-size";
import type { AppDefinition } from "./types";
import { cn, ICON_CONTAINER_BASE } from "@/lib/utils";

/** Padding from the right edge of the screen */
const GRID_PAD_RIGHT = 16;
const GRID_PAD_TOP = 16;
/** Dock clearance at the bottom */
const DOCK_CLEARANCE = 60;
/** Minimum movement before drag starts */
const DRAG_THRESHOLD = 4;

interface IconPosition {
  col: number;
  row: number;
}

function computeGrid(vh: number) {
  const small = vh > 0 && vh < 500;
  const cellW = small ? 70 : 90;
  const cellH = small ? 70 : 90;
  const padTop = small ? 8 : GRID_PAD_TOP;
  const padRight = small ? 8 : GRID_PAD_RIGHT;
  const maxRows =
    vh > 0 ? Math.max(1, Math.floor((vh - padTop - DOCK_CLEARANCE) / cellH)) : 8;
  return { cellW, cellH, padTop, padRight, maxRows };
}

function getDefaultPositions(
  apps: AppDefinition[],
  maxRows: number,
): Map<string, IconPosition> {
  const map = new Map<string, IconPosition>();
  apps.forEach((app, i) => {
    map.set(app.id, {
      col: Math.floor(i / maxRows),
      row: i % maxRows,
    });
  });
  return map;
}

interface DesktopIconsProps {
  apps: AppDefinition[];
}

export function DesktopIcons({ apps }: DesktopIconsProps) {
  const visibleApps = useMemo(() => apps.filter((a) => !a.hidden), [apps]);
  const { openWindow } = useWindowManager();
  const { height: vh } = useViewportSize();

  const { cellW, cellH, padTop, padRight, maxRows } = computeGrid(vh);
  const gridCols = Math.max(1, Math.ceil(visibleApps.length / maxRows));

  const [positions, setPositions] = useState<Map<string, IconPosition>>(() =>
    getDefaultPositions(visibleApps, maxRows),
  );

  // Recalculate positions when maxRows changes (viewport resize/rotation)
  const [prevMaxRows, setPrevMaxRows] = useState(maxRows);
  if (prevMaxRows !== maxRows) {
    setPrevMaxRows(maxRows);
    setPositions(getDefaultPositions(visibleApps, maxRows));
  }

  const dragRef = useRef<{
    appId: string;
    startX: number;
    startY: number;
    originCol: number;
    originRow: number;
    pointerId: number;
    hasMoved: boolean;
    lastDx: number;
    lastDy: number;
  } | null>(null);

  const [dragOffset, setDragOffset] = useState<{
    appId: string;
    dx: number;
    dy: number;
  } | null>(null);

  const handlePointerDown = useCallback(
    (appId: string, e: PointerEvent<HTMLButtonElement>) => {
      const pos = positions.get(appId);
      if (!pos) return;

      dragRef.current = {
        appId,
        startX: e.clientX,
        startY: e.clientY,
        originCol: pos.col,
        originRow: pos.row,
        pointerId: e.pointerId,
        hasMoved: false,
        lastDx: 0,
        lastDy: 0,
      };

      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [positions],
  );

  const handlePointerMove = useCallback((e: PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      dragRef.current.hasMoved = true;
      dragRef.current.lastDx = dx;
      dragRef.current.lastDy = dy;
      setDragOffset({ appId: dragRef.current.appId, dx, dy });
    }
  }, []);

  const handlePointerUp = useCallback(
    (appId: string) => {
      if (!dragRef.current) return;
      const ref = dragRef.current;

      if (ref.hasMoved && ref.appId === appId) {
        const pos = positions.get(appId);
        if (pos) {
          const pixelX = pos.col * cellW - ref.lastDx;
          const pixelY = pos.row * cellH + ref.lastDy;
          const newCol = Math.min(Math.max(0, Math.round(pixelX / cellW)), gridCols - 1);
          const newRow = Math.min(Math.max(0, Math.round(pixelY / cellH)), maxRows - 1);

          setPositions((prev) => {
            const next = new Map(prev);
            for (const [key, p] of next) {
              if (p.col === newCol && p.row === newRow && key !== appId) {
                next.set(key, { col: pos.col, row: pos.row });
                break;
              }
            }
            next.set(appId, { col: newCol, row: newRow });
            return next;
          });
        }
        setDragOffset(null);
      } else {
        const app = visibleApps.find((a) => a.id === appId);
        if (app) openWindow(app.id, app.defaultSize);
      }

      dragRef.current = null;
    },
    [positions, visibleApps, openWindow, cellW, cellH, gridCols, maxRows],
  );

  return (
    <div className="pointer-events-none absolute inset-0">
      {visibleApps.map((app) => {
        const pos = positions.get(app.id);
        if (!pos) return null;

        const isDragging = dragOffset?.appId === app.id;

        return (
          <button
            key={app.id}
            className={cn(
              "pointer-events-auto absolute flex flex-col items-center gap-1 rounded-lg p-2 transition-shadow",
              "hover:bg-deep-brown/5",
              isDragging && "z-50 opacity-80 shadow-lg",
            )}
            style={{
              right: padRight + pos.col * cellW,
              top: padTop + pos.row * cellH,
              width: cellW,
              height: cellH,
              ...(isDragging && {
                transform: `translate(${dragOffset.dx}px, ${dragOffset.dy}px)`,
              }),
            }}
            onPointerDown={(e) => handlePointerDown(app.id, e)}
            onPointerMove={handlePointerMove}
            onPointerUp={() => handlePointerUp(app.id)}
            aria-label={`Open ${app.title}`}
          >
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center",
                ICON_CONTAINER_BASE,
              )}
            >
              {app.icon}
            </span>
            <span className="line-clamp-2 text-center text-[11px] font-medium leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {app.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}

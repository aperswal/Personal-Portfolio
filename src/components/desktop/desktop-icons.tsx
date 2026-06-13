"use client";

import {
  useState,
  useCallback,
  useRef,
  useMemo,
  type PointerEvent,
  type KeyboardEvent,
} from "react";
import { useWindowManager } from "./window-manager";
import { useViewportSize } from "@/lib/use-viewport-size";
import { decideIconClick, type IconClick } from "@/lib/icon-click-decision";
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

const slotKey = (col: number, row: number) => `${col},${row}`;

/**
 * Recompute positions when the grid geometry changes (viewport resize/rotation)
 * WITHOUT discarding the user's manual arrangement: icons the user has dragged
 * keep their slot (re-clamped into the new bounds, bumped on collision), and
 * only the untouched icons re-flow into the remaining slots. Without this, a
 * vertical resize that changes maxRows would silently reset every icon.
 */
function reflowPositions(
  prev: Map<string, IconPosition>,
  apps: AppDefinition[],
  maxRows: number,
  moved: Set<string>,
): Map<string, IconPosition> {
  const gridCols = Math.max(1, Math.ceil(apps.length / maxRows));
  const next = new Map<string, IconPosition>();
  const occupied = new Set<string>();

  const claim = (col: number, row: number) => {
    let c = Math.min(Math.max(0, col), gridCols - 1);
    let r = Math.min(Math.max(0, row), maxRows - 1);
    while (occupied.has(slotKey(c, r))) {
      r += 1;
      if (r >= maxRows) {
        r = 0;
        c += 1;
      }
    }
    occupied.add(slotKey(c, r));
    return { col: c, row: r };
  };

  // 1. Preserve user-moved icons at their (clamped) slots.
  for (const app of apps) {
    const pos = prev.get(app.id);
    if (moved.has(app.id) && pos) next.set(app.id, claim(pos.col, pos.row));
  }
  // 2. Flow the rest into the next free default (column-major) slots.
  let slot = 0;
  for (const app of apps) {
    if (next.has(app.id)) continue;
    const placed = claim(Math.floor(slot / maxRows), slot % maxRows);
    next.set(app.id, placed);
    slot += 1;
  }
  return next;
}

interface DesktopIconsProps {
  apps: AppDefinition[];
  selectedIconId: string | null;
  onSelect: (id: string | null) => void;
}

export function DesktopIcons({ apps, selectedIconId, onSelect }: DesktopIconsProps) {
  const visibleApps = useMemo(() => apps.filter((a) => !a.hidden), [apps]);
  const { openWindow } = useWindowManager();
  const { height: vh } = useViewportSize();

  const { cellW, cellH, padTop, padRight, maxRows } = computeGrid(vh);
  const gridCols = Math.max(1, Math.ceil(visibleApps.length / maxRows));

  const [positions, setPositions] = useState<Map<string, IconPosition>>(() =>
    getDefaultPositions(visibleApps, maxRows),
  );

  // Ids of icons the user has dragged; their arrangement is preserved across
  // viewport-driven reflows rather than reset to the default layout. Held in
  // state (not a ref) so it can be read by the render-phase reflow below.
  const [userMoved, setUserMoved] = useState<Set<string>>(() => new Set());

  // Reflow positions when maxRows changes (viewport resize/rotation),
  // keeping any manually-arranged icons in place.
  const [prevMaxRows, setPrevMaxRows] = useState(maxRows);
  if (prevMaxRows !== maxRows) {
    setPrevMaxRows(maxRows);
    setPositions((prev) => reflowPositions(prev, visibleApps, maxRows, userMoved));
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

  const lastClickRef = useRef<IconClick | null>(null);

  const [dragOffset, setDragOffset] = useState<{
    appId: string;
    dx: number;
    dy: number;
  } | null>(null);

  const openApp = useCallback(
    (app: AppDefinition) => {
      openWindow(app.id, app.defaultSize);
      lastClickRef.current = null;
      onSelect(null);
    },
    [openWindow, onSelect],
  );

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
          setUserMoved((prev) => new Set(prev).add(appId));
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
        if (app) {
          const current: IconClick = { id: app.id, time: performance.now() };
          if (decideIconClick(lastClickRef.current, current) === "open") {
            openApp(app);
          } else {
            onSelect(app.id);
            lastClickRef.current = current;
          }
        }
      }

      dragRef.current = null;
    },
    [positions, visibleApps, openApp, onSelect, cellW, cellH, gridCols, maxRows],
  );

  const handleKeyDown = useCallback(
    (app: AppDefinition, e: KeyboardEvent<HTMLButtonElement>) => {
      // A native <button> activates on both Enter and Space; honor that
      // contract (WCAG 2.1.1). preventDefault on Space also suppresses the
      // page scroll and the native keyup-synthesized click.
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openApp(app);
      }
    },
    [openApp],
  );

  return (
    <div className="pointer-events-none absolute inset-0">
      {visibleApps.map((app) => {
        const pos = positions.get(app.id);
        if (!pos) return null;

        const isDragging = dragOffset?.appId === app.id;
        const isSelected = selectedIconId === app.id;

        return (
          <button
            key={app.id}
            className={cn(
              "pointer-events-auto absolute flex flex-col items-center gap-1 rounded-lg p-2 transition-shadow",
              isSelected ? "bg-white/20 ring-1 ring-white/40" : "hover:bg-deep-brown/5",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
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
            onKeyDown={(e) => handleKeyDown(app, e)}
            aria-pressed={isSelected}
            aria-label={app.title}
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

"use client";

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { withNoSSR } from '@/lib/utils/dynamic';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

export interface WindowProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
  children: React.ReactNode;
  defaultPosition?: Position;
  isMinimized: boolean;
  dockBounds?: DOMRect | null;
  onMaximizedChange?: (isMaximized: boolean) => void;
}

const WindowComponent: React.FC<WindowProps> = ({
  title,
  isOpen,
  onClose,
  onMinimize,
  onMaximize,
  isMaximized,
  children,
  defaultPosition = { x: 50, y: 50 },
  isMinimized,
  dockBounds,
  onMaximizedChange
}) => {
  const [position, setPosition] = useState<Position>(defaultPosition);
  const [size, setSize] = useState<Size>({ width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState<Size>({ width: 0, height: 0 });
  const [startPosition, setStartPosition] = useState<Position>({ x: 0, y: 0 });
  const [showDock, setShowDock] = useState(true);
  const windowRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const dockTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Get dock icon position for minimize animation
  const [minimizeTarget, setMinimizeTarget] = useState(() => ({
    x: 0,
    y: typeof window !== 'undefined' ? window.innerHeight : 0
  }));

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (dockBounds) {
      setMinimizeTarget({
        x: dockBounds.x,
        y: dockBounds.y
      });
    }
  }, [dockBounds]);

  // Handle dock visibility
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isMaximized) {
        if (e.clientY > window.innerHeight - 50) {
          setShowDock(true);
          if (dockTimeoutRef.current) {
            clearTimeout(dockTimeoutRef.current);
          }
        } else {
          if (dockTimeoutRef.current) {
            clearTimeout(dockTimeoutRef.current);
          }
          dockTimeoutRef.current = setTimeout(() => {
            setShowDock(false);
          }, 1000);
        }
      }
    };

    if (isMaximized) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      setShowDock(true);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (dockTimeoutRef.current) {
        clearTimeout(dockTimeoutRef.current);
      }
    };
  }, [isMaximized]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMaximized) {
        if (isDragging) {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }

          animationFrameRef.current = requestAnimationFrame(() => {
            const newX = e.clientX - dragOffset.x;
            const newY = Math.max(0, e.clientY - dragOffset.y); // Prevent dragging behind toolbar
            const maxX = window.innerWidth - (windowRef.current?.offsetWidth || 0);
            const maxY = window.innerHeight - (windowRef.current?.offsetHeight || 0);
            setPosition({
              x: Math.max(0, Math.min(newX, maxX)),
              y: Math.max(0, Math.min(newY, maxY))
            });
          });
        } else if (isResizing) {
          e.preventDefault();
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }

          animationFrameRef.current = requestAnimationFrame(() => {
            const dx = e.clientX - startPosition.x;
            const dy = e.clientY - startPosition.y;
            const minWidth = 400;
            const minHeight = 300;
            const maxWidth = window.innerWidth - position.x;
            const maxHeight = window.innerHeight - position.y;

            let newWidth = startSize.width;
            let newHeight = startSize.height;
            let newX = position.x;
            let newY = position.y;

            if (resizeDirection.includes('e')) {
              newWidth = Math.max(minWidth, Math.min(startSize.width + dx, maxWidth));
            }
            if (resizeDirection.includes('s')) {
              newHeight = Math.max(minHeight, Math.min(startSize.height + dy, maxHeight));
            }
            if (resizeDirection.includes('w')) {
              const deltaWidth = Math.max(minWidth, Math.min(startSize.width - dx, startPosition.x + startSize.width));
              newX = position.x + (startSize.width - deltaWidth);
              newWidth = deltaWidth;
            }
            if (resizeDirection.includes('n')) {
              const deltaHeight = Math.max(minHeight, Math.min(startSize.height - dy, startPosition.y + startSize.height));
              newY = position.y + (startSize.height - deltaHeight);
              newHeight = deltaHeight;
            }

            setSize({ width: newWidth, height: newHeight });
            setPosition({ x: newX, y: newY });
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDragging, isResizing, dragOffset, isMaximized]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    e.preventDefault();

    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const startResize = (direction: string) => (e: React.MouseEvent) => {
    if (isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeDirection(direction);
    setStartSize(size);
    setStartPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    onMaximizedChange?.(isMaximized);
  }, [isMaximized, onMaximizedChange]);

  if (!isMounted) {
    return null; // or a loading state
  }

  return (
    <div
      ref={windowRef}
      className={cn(
        "fixed bg-gray-800/95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-700/50",
        isMaximized ? "top-7 left-0 right-0 bottom-0 rounded-none" : "",
        isMinimized && "pointer-events-none",
        isDragging && "cursor-grabbing",
        isMaximized && !showDock ? "z-10" : "z-20"
      )}
      style={{
        ...(!isMaximized ? {
          left: position.x,
          top: Math.max(28, position.y),
          width: size.width,
          height: Math.min(size.height, window.innerHeight - Math.max(28, position.y)),
        } : undefined),
        transform: isMinimized 
          ? `scale(0.1) translate(${minimizeTarget.x}px, ${minimizeTarget.y}px)` 
          : undefined,
        opacity: isMinimized ? 0 : 1,
        transition: isDragging || isResizing ? 'none' : 'all 0.3s ease-in-out',
        willChange: isDragging || isResizing ? 'transform' : 'auto'
      }}
    >
      {/* Window Title Bar */}
      <div 
        className={cn(
          "h-8 bg-gray-700/50 rounded-t-lg flex items-center relative",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        onMouseDown={handleMouseDown}
      >
        {/* Window Controls - explicitly positioned at left */}
        <div className="absolute left-3 flex space-x-2 z-10">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            title="Close"
          />
          <button
            onClick={onMinimize}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
            title="Minimize"
          />
          <button
            onClick={onMaximize}
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
            title="Maximize"
          />
        </div>

        {/* Window Title - centered */}
        <div className="flex-1 text-center text-sm text-gray-300">
          {title}
        </div>
      </div>

      {/* Window Content */}
      <div className="overflow-auto" style={{ height: 'calc(100% - 2rem)' }}>
        {children}
      </div>

      {/* Resize Handles */}
      {!isMaximized && (
        <>
          <div className="absolute inset-0 pointer-events-none border border-transparent hover:border-blue-500/30 rounded-lg" />
          <div className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize" onMouseDown={startResize('nw')} />
          <div className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize" onMouseDown={startResize('ne')} />
          <div className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize" onMouseDown={startResize('sw')} />
          <div className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize" onMouseDown={startResize('se')} />
          <div className="absolute top-0 left-2 right-2 h-1 cursor-n-resize" onMouseDown={startResize('n')} />
          <div className="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize" onMouseDown={startResize('s')} />
          <div className="absolute left-0 top-2 bottom-2 w-1 cursor-w-resize" onMouseDown={startResize('w')} />
          <div className="absolute right-0 top-2 bottom-2 w-1 cursor-e-resize" onMouseDown={startResize('e')} />
        </>
      )}
    </div>
  );
};

export const Window = withNoSSR(WindowComponent); 
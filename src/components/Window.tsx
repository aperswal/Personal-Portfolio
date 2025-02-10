import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface WindowProps {
  title: string;
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

export function Window({
  title,
  onClose,
  onMinimize,
  onMaximize,
  isMaximized,
  children,
  defaultPosition = { x: 50, y: 50 },
  isMinimized,
  dockBounds,
  onMaximizedChange
}: WindowProps) {
  const [position, setPosition] = useState<Position>(defaultPosition);
  const [size, setSize] = useState<Size>({ width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [startSize, setStartSize] = useState<Size>({ width: 0, height: 0 });
  const [startPosition, setStartPosition] = useState<Position>({ x: 0, y: 0 });
  const [showDock, setShowDock] = useState(true);
  const windowRef = useRef<HTMLDivElement>(null);
  const dockTimeoutRef = useRef<NodeJS.Timeout>();

  // Get dock icon position for minimize animation
  const [minimizeTarget, setMinimizeTarget] = useState({ x: 0, y: window.innerHeight });

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
    if (!isDragging || !startPosition) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startPosition.x;
      const deltaY = e.clientY - startPosition.y;
      setPosition({
        x: position.x + deltaX,
        y: position.y + deltaY
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setStartPosition(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startPosition, position.x, position.y]);

  // Similar fix for resize effect
  useEffect(() => {
    if (!isResizing || !startPosition || !startSize || !resizeDirection) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startPosition.x;
      const deltaY = e.clientY - startPosition.y;

      const newSize = {
        width: startSize.width,
        height: startSize.height
      };

      // Update size based on resize direction
      if (resizeDirection.includes('e')) {
        newSize.width += deltaX;
      }
      if (resizeDirection.includes('s')) {
        newSize.height += deltaY;
      }
      if (resizeDirection.includes('w')) {
        newSize.width -= deltaX;
        setPosition(prev => ({ ...prev, x: position.x + deltaX }));
      }
      if (resizeDirection.includes('n')) {
        newSize.height -= deltaY;
        setPosition(prev => ({ ...prev, y: position.y + deltaY }));
      }

      setSize(newSize);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setStartPosition(null);
      setStartSize(null);
      setResizeDirection(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, startPosition, startSize, resizeDirection, position.x, position.y]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    e.preventDefault();

    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsDragging(true);
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
} 
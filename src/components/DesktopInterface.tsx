"use client";

import { useState, useEffect, useRef, RefObject, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Window } from './Window';
import type { WindowProps } from './Window';
import { MobileWarning } from './MobileWarning';
import { WallpaperPreloader } from './WallpaperPreloader';
import { Finder } from './Finder';
import { MenuBar } from './MenuBar';
import { withNoSSR } from '@/lib/utils/dynamic';

// Import all app components
import { About } from './apps/About';
import { AboutSite } from './apps/AboutSite';
import { Contact } from './apps/Contact';
import { CoverLetter } from './apps/CoverLetter';
import { Education } from './apps/Education';
import { Projects } from './apps/Projects';
import { Skills } from './apps/Skills';
import { Terminal } from './apps/Terminal';
import { WorkHistory } from './apps/WorkHistory';

// Import media apps
import { Books } from './apps/media/Books';
import { Gallery } from './apps/media/Gallery';
import { Movies } from './apps/media/Movies';
import { Music } from './apps/media/Music';
import { Phone } from './apps/Phone';

// Update type for dock icon refs
type DockIconRefs = Map<string, HTMLElement>;

interface DesktopIcon {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

const wallpapers = [
  '/wallpapers/wallpaper1.jpg',
  '/wallpapers/wallpaper2.jpg',
  '/wallpapers/wallpaper3.jpg',
  '/wallpapers/wallpaper4.jpg',
  '/wallpapers/wallpaper5.jpg',
  '/wallpapers/wallpaper6.jpg',
  '/wallpapers/wallpaper7.jpg',
];

// Add a new CSS class for dock animations with scaling
const getDockItemClass = (scale: number) => `
  relative flex flex-col items-center justify-center
  transition-all duration-150 ease-in-out
  hover:scale-150
  group
`;

// Define screen size breakpoints and scaling factors
interface ScreenScale {
  scale: number;
  iconSize: number;
  iconGap: number;
  iconColumns: number;
  maxIconsPerColumn: number;
}

// Function to calculate scaling based on screen dimensions
const calculateScreenScale = (width: number, height: number): ScreenScale => {
  // Base scale calculated from screen diagonal (approximating screen size)
  const diagonal = Math.sqrt(width * width + height * height);
  
  // Reference values for a 15-inch display (approx 1440x900 resolution)
  const referenceWidth = 1440;
  const referenceHeight = 900;
  const referenceDiagonal = Math.sqrt(referenceWidth * referenceWidth + referenceHeight * referenceHeight);
  
  // Calculate base scale based on diagonal ratio
  const baseScale = Math.min(1, Math.max(0.6, diagonal / referenceDiagonal));
  
  // For different screen sizes:
  if (diagonal > referenceDiagonal * 1.1) {
    // Larger screens (16+ inch)
    return {
      scale: Math.min(1.15, baseScale),
      iconSize: 100,
      iconGap: 12,
      iconColumns: Math.min(4, Math.floor(width / 320)),
      maxIconsPerColumn: Math.floor(height / 140)
    };
  } else if (diagonal < referenceDiagonal * 0.85) {
    // Smaller screens (13-14 inch)
    return {
      scale: Math.max(0.75, baseScale),
      iconSize: 80,
      iconGap: 6,
      iconColumns: Math.max(2, Math.min(3, Math.floor(width / 220))),
      maxIconsPerColumn: Math.floor(height / 110)
    };
  } else {
    // Medium screens (15 inch - baseline)
    return {
      scale: 1,
      iconSize: 90,
      iconGap: 8,
      iconColumns: 3,
      maxIconsPerColumn: Math.floor(height / 120)
    };
  }
};

const DesktopInterface = () => {
  const [activeWindows, setActiveWindows] = useState<Set<string>>(new Set());
  const [maximizedWindow, setMaximizedWindow] = useState<string | null>(null);
  const [minimizedWindows, setMinimizedWindows] = useState<Set<string>>(new Set());
  const [ignoreMobileWarning, setIgnoreMobileWarning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentWallpaper, setCurrentWallpaper] = useState(0);
  const [nextWallpaper, setNextWallpaper] = useState(1);
  // Replace state with ref
  const dockIconRefs = useRef<DockIconRefs>(new Map());
  const [showDock, setShowDock] = useState(true);
  const dockTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [isWallpaperTransitioning, setIsWallpaperTransitioning] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Add screen scale state
  const [screenScale, setScreenScale] = useState<ScreenScale>({
    scale: 1,
    iconSize: 90,
    iconGap: 8,
    iconColumns: 3,
    maxIconsPerColumn: 5
  });
  
  // Add window dimensions state
  const [windowDimensions, setWindowDimensions] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900
  });

  const handleWindowOpen = (id: string) => {
    setActiveWindows(prev => new Set([...prev, id]));
    setMinimizedWindows(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleWindowClose = (id: string) => {
    setActiveWindows(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (maximizedWindow === id) {
      setMaximizedWindow(null);
    }
  };

  const handleWindowMinimize = (id: string) => {
    setMinimizedWindows(prev => new Set([...prev, id]));
    if (maximizedWindow === id) {
      setMaximizedWindow(null);
    }
  };

  const handleWindowMaximize = (id: string) => {
    setMaximizedWindow(prev => prev === id ? null : id);
  };

  // Update getDockIconPosition to use ref
  const getDockIconPosition = (id: string) => {
    const element = dockIconRefs.current.get(id);
    return element?.getBoundingClientRect() || null;
  };

  // Define desktopIcons after the handlers
  const desktopIcons: DesktopIcon[] = [
    {
      id: 'about-site',
      title: 'About This Site.rtf',
      icon: 'ℹ️',
      content: <AboutSite />
    },
    {
      id: 'education',
      title: 'Education.app',
      icon: '🎓',
      content: <Education />
    },
    {
      id: 'work-history',
      title: 'Work History.app',
      icon: '💼',
      content: <WorkHistory />
    },
    {
      id: 'about-me',
      title: 'AboutMe.app',
      icon: '👤',
      content: <About />
    },
    {
      id: 'projects',
      title: 'Projects.app',
      icon: '💻',
      content: <Projects />
    },
    {
      id: 'skills',
      title: 'Skills.plist',
      icon: '🎯',
      content: <Skills />
    },
    {
      id: 'contact',
      title: 'Contact.txt',
      icon: '📧',
      content: <Contact />
    },
    {
      id: 'terminal',
      title: 'Terminal.app',
      icon: '⌨️',
      content: <Terminal />
    },
    {
      id: 'movies',
      title: 'Movies.app',
      icon: '🎬',
      content: <Movies />
    },
    {
      id: 'music',
      title: 'Music.app',
      icon: '🎵',
      content: <Music />
    },
    {
      id: 'books',
      title: 'Books.app',
      icon: '📚',
      content: <Books />
    },
    {
      id: 'gallery',
      title: 'Gallery.app',
      icon: '🖼️',
      content: <Gallery />
    },
    {
      id: 'cover-letter',
      title: 'Cover Letter.txt',
      icon: '✉️',
      content: <CoverLetter />
    },
    {
      id: 'finder',
      title: 'Finder',
      icon: '📁',
      content: (
        <Finder 
          onOpenFile={handleWindowOpen}
          isOpen={activeWindows.has('finder')}
          onClose={() => handleWindowClose('finder')}
        />
      )
    },
    {
      id: 'phone',
      title: 'Phone.app',
      icon: '📱',
      content: <Phone />
    },
  ];

  const dockIcons = [
    // Frequently Used
    { id: 'finder', icon: '📁', title: 'Finder' },
    { id: 'terminal', icon: '⌨️', title: 'Terminal.app' },
    { id: 'about-me', icon: '👤', title: 'AboutMe.app' },
    { id: 'education', icon: '🎓', title: 'Education.app' },
    { id: 'work-history', icon: '💼', title: 'Work History.app' },
    { id: 'cover-letter', icon: '✉️', title: 'Cover Letter.txt' },
    
    // Separator
    null,
    
    // Media Apps
    { id: 'movies', icon: '🎬', title: 'Movies.app' },
    { id: 'music', icon: '🎵', title: 'Music.app' },
    { id: 'gallery', icon: '🖼️', title: 'Gallery.app' },
    { id: 'books', icon: '📚', title: 'Books.app' },
    
    // Separator
    null,
    
    // Content & Communication
    { id: 'projects', icon: '💻', title: 'Projects.app' },
    { id: 'skills', icon: '🎯', title: 'Skills.plist' },
    { id: 'contact', icon: '📧', title: 'Contact.txt' },
    
    // Separator
    null,
    
    // System
    { id: 'phone', icon: '📱', title: 'Phone.app' },
    { id: 'settings', icon: '⚙️', title: 'Settings.app' },
    { id: 'trash', icon: '🗑️', title: 'Trash' },
  ];

  // Effects
  useEffect(() => {
    const rotateWallpaper = () => {
      setIsWallpaperTransitioning(true);
      const next = (currentWallpaper + 1) % wallpapers.length;
      setNextWallpaper(next);
      setTimeout(() => {
        setCurrentWallpaper(next);
        setIsWallpaperTransitioning(false);
      }, 1000);
    };

    const interval = setInterval(rotateWallpaper, 30000);
    return () => clearInterval(interval);
  }, [currentWallpaper]);

  useEffect(() => {
    // Check if device is mobile and calculate screen scale
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowDimensions({ width, height });
      setIsMobile(width <= 768); // Mobile breakpoint
      
      // Calculate scaling factors based on screen size
      if (width > 768) { // Only apply scaling for non-mobile
        const newScale = calculateScreenScale(width, height);
        setScreenScale(newScale);
        console.log('Screen scaling updated:', newScale);
      }
    };

    // Initial check
    updateScreenSize();

    // Check on resize
    window.addEventListener('resize', updateScreenSize);
    
    // Check if warning was previously ignored
    const ignored = localStorage.getItem('ignoreMobileWarning') === 'true';
    setIgnoreMobileWarning(ignored);

    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Update dock visibility handler with shorter timeout
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (maximizedWindow) {
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
          }, 200); // Reduced from 500ms to 200ms for faster hiding
        }
      } else {
        setShowDock(true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (dockTimeoutRef.current) {
        clearTimeout(dockTimeoutRef.current);
      }
    };
  }, [maximizedWindow]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderWindow = (id: string) => {
    const icon = desktopIcons.find(i => i.id === id);
    if (!icon) return null;
    
    const windowProps: WindowProps = {
      title: icon.title,
      isOpen: true,
      onClose: () => handleWindowClose(id),
      onMinimize: () => handleWindowMinimize(id),
      onMaximize: () => handleWindowMaximize(id),
      isMaximized: maximizedWindow === id,
      isMinimized: minimizedWindows.has(id),
      dockBounds: getDockIconPosition(id),
      defaultPosition: { 
        x: 50 + (activeWindows.size * 20), 
        y: 50 + (activeWindows.size * 20) 
      },
      scale: screenScale.scale,
      children: icon.content
    };
    
    return <Window key={id} {...windowProps} />;
  };

  // Add a function to organize desktop icons into a grid
  const organizeDesktopIcons = () => {
    const { iconColumns, maxIconsPerColumn } = screenScale;
    
    // Create a grid layout with the maximum number of icons per column
    let grid: DesktopIcon[][] = Array(iconColumns).fill(0).map(() => []);
    
    // Distribute icons across columns
    desktopIcons.forEach((icon, index) => {
      const columnIndex = index % iconColumns;
      grid[columnIndex].push(icon);
    });
    
    // Ensure no column exceeds maxIconsPerColumn
    grid = grid.map(column => {
      if (column.length > maxIconsPerColumn) {
        // If there are more icons than maxIconsPerColumn, distribute to other columns
        return column.slice(0, maxIconsPerColumn);
      }
      return column;
    });
    
    return grid;
  };
  
  // Desktop Icons rendering with new organization
  const renderDesktopIcons = () => {
    // Use single flat array of icons if we have no dimensions yet
    if (!isMounted || windowDimensions.width === 0) {
      return desktopIcons.map((icon, index) => renderDesktopIcon(icon, index));
    }
    
    // Organize icons into a grid
    const iconGrid = organizeDesktopIcons();
    
    return (
      <div 
        className="grid gap-x-4" 
        style={{ 
          gridTemplateColumns: `repeat(${screenScale.iconColumns}, minmax(0, 1fr))`,
          gap: `${screenScale.iconGap * screenScale.scale}px`,
          marginRight: `${20 * screenScale.scale}px`,
        }}
      >
        {iconGrid.map((column, colIndex) => (
          <div key={`col-${colIndex}`} className="flex flex-col gap-y-4">
            {column.map((icon, iconIndex) => renderDesktopIcon(icon, colIndex * 10 + iconIndex))}
          </div>
        ))}
      </div>
    );
  };
  
  // Individual desktop icon renderer
  const renderDesktopIcon = (icon: DesktopIcon, index: number) => {
    return (
      <button
        key={icon.id}
        onClick={() => handleWindowOpen(icon.id)}
        className="desktop-icon group flex flex-col items-center"
        style={{ 
          animationDelay: `${index * 100}ms`,
          width: `${screenScale.iconSize * screenScale.scale}px`,
          height: `${screenScale.iconSize * 1.3 * screenScale.scale}px`,
        }}
      >
        <div className="relative p-3 rounded-xl group-hover:bg-white/10 transition-all flex flex-col items-center">
          <span className="block mb-2 group-hover:scale-110 transition-transform drop-shadow-lg" 
                style={{ fontSize: `${3 * screenScale.scale}rem` }}>
            {icon.icon}
          </span>
          <span 
            className="text-sm font-medium text-center break-words text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)] line-clamp-2 px-1"
            style={{ fontSize: `${0.875 * screenScale.scale}rem` }}
          >
            {icon.title}
          </span>
        </div>
      </button>
    );
  };

  if (!isMounted) {
    return (
      <div className="fixed inset-0 bg-black min-h-screen flex items-center justify-center">
        <div className="text-green-500 font-mono animate-pulse">
          Loading desktop...
        </div>
      </div>
    );
  }

  if (isMobile && !ignoreMobileWarning) {
    return <MobileWarning />;
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <WallpaperPreloader wallpapers={wallpapers} />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <MenuBar 
          onMinimize={handleWindowMinimize}
          onMaximize={handleWindowMaximize}
          onClose={handleWindowClose}
          activeWindowId={maximizedWindow}
          scale={screenScale.scale}
        />
        
        {/* Current Wallpaper */}
        <div 
          className={cn(
            "absolute inset-0 z-0 transition-opacity duration-1000",
            isWallpaperTransitioning ? "opacity-0" : "opacity-80"
          )}
          style={{ 
            backgroundImage: `url(${wallpapers[currentWallpaper]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(0.9)',
          }}
        />

        {/* Next Wallpaper - Preloaded */}
        <div 
          className={cn(
            "absolute inset-0 z-0 transition-opacity duration-1000",
            isWallpaperTransitioning ? "opacity-80" : "opacity-0"
          )}
          style={{ 
            backgroundImage: `url(${wallpapers[nextWallpaper]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(0.9)',
          }}
        />
        
        {/* Lighter overlay gradient for better wallpaper visibility */}
        <div 
          className="absolute inset-0 z-[1] bg-gradient-to-b from-black/10 to-black/20"
        />

        {/* Desktop Icons - with responsive layout */}
        <div 
          className="fixed z-[2]" 
          style={{ 
            right: `${12 * screenScale.scale}px`, 
            top: `${12 * screenScale.scale}px`
          }}
        >
          {renderDesktopIcons()}
        </div>

        {/* Windows Layer */}
        <div className="relative z-[3]">
          {Array.from(activeWindows).map(id => renderWindow(id))}
        </div>

        {/* Enhanced Dock with scaling */}
        <div 
          className={cn(
            "fixed bottom-4 left-1/2 -translate-x-1/2 z-[4] transition-all duration-300",
            showDock ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          )}
          style={{
            bottom: `${16 * screenScale.scale}px`,
            transform: `translateX(-50%) scale(${screenScale.scale})`,
            transformOrigin: 'bottom center'
          }}
        >
          <div className="flex items-end gap-4 px-8 py-3 bg-gray-800/40 backdrop-blur-md rounded-2xl border border-white/10"
               style={{ 
                 padding: `${12 * screenScale.scale}px ${32 * screenScale.scale}px`,
                 gap: `${16 * screenScale.scale}px`,
                 borderRadius: `${16 * screenScale.scale}px`,
               }}>
            {dockIcons.map((icon, index) => (
              icon === null ? (
                <div 
                  key={`separator-${index}`} 
                  className="w-px h-10 bg-white/20 mx-4" 
                  style={{ 
                    width: `${1 * screenScale.scale}px`, 
                    height: `${40 * screenScale.scale}px`,
                    margin: `0 ${16 * screenScale.scale}px`,
                  }} 
                />
              ) : (
                <div 
                  key={icon.id} 
                  className="group/dock relative py-2 px-1"
                  style={{ 
                    padding: `${8 * screenScale.scale}px ${4 * screenScale.scale}px`
                  }}
                >
                  <button 
                    ref={(el) => {
                      if (el) {
                        dockIconRefs.current.set(icon.id, el);
                      } else {
                        dockIconRefs.current.delete(icon.id);
                      }
                    }}
                    className={getDockItemClass(screenScale.scale)}
                    onClick={() => {
                      if (minimizedWindows.has(icon.id)) {
                        setMinimizedWindows(prev => {
                          const next = new Set(prev);
                          next.delete(icon.id);
                          return next;
                        });
                      } else if (!activeWindows.has(icon.id)) {
                        handleWindowOpen(icon.id);
                      }
                    }}
                  >
                    {/* Show minimized window preview if it exists */}
                    {minimizedWindows.has(icon.id) ? (
                      <div 
                        className="absolute -top-32 scale-0 group-hover/dock:scale-100 transition-all"
                        style={{ 
                          top: `-${128 * screenScale.scale}px`,
                        }}
                      >
                        <div 
                          className="w-48 h-32 bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg overflow-hidden"
                          style={{ 
                            width: `${192 * screenScale.scale}px`, 
                            height: `${128 * screenScale.scale}px`,
                            borderRadius: `${8 * screenScale.scale}px`,
                          }}
                        >
                          {/* Mini preview of the window content */}
                          <div className="w-full h-full transform scale-[0.2] origin-top-left">
                            {desktopIcons.find(di => di.id === icon.id)?.content}
                          </div>
                        </div>
                      </div>
                    ) : null}
                    <span 
                      className="text-5xl transition-all duration-150 group-hover/dock:scale-125"
                      style={{ 
                        fontSize: `${48 * screenScale.scale}px`,
                      }}
                    >
                      {icon.icon}
                    </span>
                    <span 
                      className="absolute -top-10 scale-0 group-hover/dock:scale-100 transition-all bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs whitespace-nowrap"
                      style={{ 
                        top: `-${40 * screenScale.scale}px`,
                        padding: `${6 * screenScale.scale}px ${12 * screenScale.scale}px`,
                        fontSize: `${12 * screenScale.scale}px`,
                        borderRadius: `${8 * screenScale.scale}px`,
                      }}
                    >
                      {icon.title}
                    </span>
                    {/* Show dot indicator for minimized windows */}
                    {minimizedWindows.has(icon.id) && (
                      <span 
                        className="absolute -bottom-1 w-1 h-1 rounded-full bg-white" 
                        style={{ 
                          bottom: `-${4 * screenScale.scale}px`,
                          width: `${4 * screenScale.scale}px`,
                          height: `${4 * screenScale.scale}px`,
                        }}
                      />
                    )}
                  </button>
                </div>
              )
            ))}
          </div>
          {/* Dock Reflection */}
          <div 
            className="dock-reflection"
            style={{ 
              height: `${20 * screenScale.scale}px`,
              bottom: `-${10 * screenScale.scale}px`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default withNoSSR(DesktopInterface); 
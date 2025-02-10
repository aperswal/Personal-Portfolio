"use client";

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Window } from './Window';
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

// Add a new CSS class for dock animations
const dockItemClass = `
  relative flex flex-col items-center justify-center
  transition-all duration-150 ease-in-out
  hover:scale-150
  group
`;

const DesktopInterfaceComponent = () => {
  const [activeWindows, setActiveWindows] = useState<Set<string>>(new Set());
  const [maximizedWindow, setMaximizedWindow] = useState<string | null>(null);
  const [minimizedWindows, setMinimizedWindows] = useState<Set<string>>(new Set());
  const [ignoreMobileWarning, setIgnoreMobileWarning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentWallpaper, setCurrentWallpaper] = useState(0);
  const [nextWallpaper, setNextWallpaper] = useState(1);
  const [dockIconRefs] = useState<Map<string, HTMLElement>>(new Map());
  const [showDock, setShowDock] = useState(true);
  const dockTimeoutRef = useRef<NodeJS.Timeout>();
  const [isWallpaperTransitioning, setIsWallpaperTransitioning] = useState(false);

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

  const getDockIconPosition = (id: string) => {
    const element = dockIconRefs.get(id);
    return element?.getBoundingClientRect() || null;
  };

  // Define desktopIcons after the handlers
  const desktopIcons: DesktopIcon[] = [
    {
      id: 'about-site',
      title: 'About Site.txt',
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
      title: 'AboutMe.exe',
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
      title: 'Skills.sys',
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
    { id: 'about-me', icon: '👤', title: 'AboutMe.exe' },
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
    { id: 'blogs', icon: '📝', title: 'Blogs.app' },
    { id: 'projects', icon: '💻', title: 'Projects.app' },
    { id: 'skills', icon: '🎯', title: 'Skills.sys' },
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
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobile();

    // Check on resize
    window.addEventListener('resize', checkMobile);
    
    // Check if warning was previously ignored
    const ignored = localStorage.getItem('ignoreMobileWarning') === 'true';
    setIgnoreMobileWarning(ignored);

    return () => window.removeEventListener('resize', checkMobile);
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

  if (isMobile && !ignoreMobileWarning) {
    return <MobileWarning />;
  }

  return (
    <>
      <WallpaperPreloader wallpapers={wallpapers} />
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen text-white relative overflow-hidden">
        <MenuBar 
          onMinimize={handleWindowMinimize}
          onMaximize={handleWindowMaximize}
          onClose={handleWindowClose}
          activeWindowId={maximizedWindow}
        />
        
        {/* Current Wallpaper */}
        <div 
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
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
            "absolute inset-0 transition-opacity duration-1000",
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
          className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/20 z-[1]"
        />

        {/* Desktop Icons - Updated for right alignment and bigger size */}
        <div className="fixed right-12 top-12 z-10">
          <div 
            className="grid grid-cols-3 gap-8 justify-items-end" 
            style={{ 
              gridTemplateRows: 'repeat(auto-fill, 120px)',
              direction: 'rtl'  // This helps with right alignment
            }}
          >
            {desktopIcons.map((icon, index) => (
              <button
                key={icon.id}
                onClick={() => handleWindowOpen(icon.id)}
                className="desktop-icon group flex flex-col items-center w-28"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  direction: 'ltr'  // Reset direction for icon content
                }}
              >
                <div className="relative p-3 rounded-xl group-hover:bg-white/10 transition-all">
                  <span className="text-5xl block mb-2 group-hover:scale-110 transition-transform drop-shadow-lg">
                    {icon.icon}
                  </span>
                  <span className="text-sm font-medium text-center break-words text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)] line-clamp-2 px-1">
                    {icon.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Windows */}
        {Array.from(activeWindows).map(id => {
          const icon = desktopIcons.find(icon => icon.id === id);
          if (!icon) return null;

          return (
            <Window
              key={id}
              title={icon.title}
              isOpen={true}
              onClose={() => handleWindowClose(id)}
              onMinimize={() => handleWindowMinimize(id)}
              onMaximize={() => handleWindowMaximize(id)}
              isMaximized={maximizedWindow === id}
              isMinimized={minimizedWindows.has(id)}
              dockBounds={getDockIconPosition(id)}
              defaultPosition={{ 
                x: 50 + (Array.from(activeWindows).indexOf(id) * 30), 
                y: 50 + (Array.from(activeWindows).indexOf(id) * 30) 
              }}
            >
              {icon.content}
            </Window>
          );
        })}

        {/* Enhanced Dock */}
        <div 
          className={cn(
            "fixed bottom-4 left-1/2 -translate-x-1/2 transition-all duration-300",
            showDock ? "z-30 translate-y-0 opacity-100" : "z-0 translate-y-20 opacity-0"
          )}
        >
          <div className="flex items-end gap-4 px-8 py-3 bg-gray-800/40 backdrop-blur-md rounded-2xl border border-white/10">
            {dockIcons.map((icon, index) => (
              icon === null ? (
                <div key={`separator-${index}`} className="w-px h-10 bg-white/20 mx-4" />
              ) : (
                <div key={icon.id} className="group/dock relative py-2 px-1">
                  <button 
                    ref={(el) => el && dockIconRefs.set(icon.id, el)}
                    className={dockItemClass}
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
                      <div className="absolute -top-32 scale-0 group-hover/dock:scale-100 transition-all">
                        <div className="w-48 h-32 bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg overflow-hidden">
                          {/* Mini preview of the window content */}
                          <div className="w-full h-full transform scale-[0.2] origin-top-left">
                            {desktopIcons.find(di => di.id === icon.id)?.content}
                          </div>
                        </div>
                      </div>
                    ) : null}
                    <span className="text-5xl transition-all duration-150 group-hover/dock:scale-125">
                      {icon.icon}
                    </span>
                    <span className="absolute -top-10 scale-0 group-hover/dock:scale-100 transition-all bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs whitespace-nowrap">
                      {icon.title}
                    </span>
                    {/* Show dot indicator for minimized windows */}
                    {minimizedWindows.has(icon.id) && (
                      <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-white" />
                    )}
                  </button>
                </div>
              )
            ))}
          </div>
          {/* Dock Reflection */}
          <div className="dock-reflection" />
        </div>
      </div>
    </>
  );
};

export const DesktopInterface = withNoSSR(DesktopInterfaceComponent); 
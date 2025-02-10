import { useState } from 'react';
import { cn } from '@/lib/utils';

interface MenuItem {
  label: string;
  action?: () => void;
  shortcut?: string;
  submenu?: MenuItem[];
  separator?: boolean;
}

interface MenuBarProps {
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onClose: (id: string) => void;
  activeWindowId: string | null;
}

export function MenuBar({ onMinimize, onMaximize, onClose, activeWindowId }: MenuBarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menuItems: Record<string, MenuItem[]> = {
    Finder: [
      { label: 'About This Mac', action: () => window.open('https://apple.com/mac', '_blank') },
      { separator: true },
      { label: 'System Settings...', action: () => {}, shortcut: '⌘,' },
      { separator: true },
      { label: 'Sleep', action: () => {} },
      { label: 'Restart...', action: () => window.location.reload() },
      { label: 'Shut Down...', action: () => window.close() },
    ],
    File: [
      { label: 'New Window', action: () => {}, shortcut: '⌘N' },
      { label: 'New Tab', action: () => {}, shortcut: '⌘T' },
      { separator: true },
      { 
        label: 'Close', 
        action: () => activeWindowId && onClose(activeWindowId), 
        shortcut: '⌘W' 
      },
      { label: 'Save', action: () => {}, shortcut: '⌘S' },
    ],
    Edit: [
      { label: 'Undo', action: () => document.execCommand('undo'), shortcut: '⌘Z' },
      { label: 'Redo', action: () => document.execCommand('redo'), shortcut: '⇧⌘Z' },
      { separator: true },
      { label: 'Cut', action: () => document.execCommand('cut'), shortcut: '⌘X' },
      { label: 'Copy', action: () => document.execCommand('copy'), shortcut: '⌘C' },
      { label: 'Paste', action: () => document.execCommand('paste'), shortcut: '⌘V' },
      { label: 'Select All', action: () => document.execCommand('selectAll'), shortcut: '⌘A' },
    ],
    View: [
      { label: 'as Icons', action: () => {}, shortcut: '⌘1' },
      { label: 'as List', action: () => {}, shortcut: '⌘2' },
      { separator: true },
      { label: 'Show Hidden Files', action: () => {}, shortcut: '⇧⌘.' },
    ],
    Window: [
      { 
        label: 'Minimize', 
        action: () => activeWindowId && onMinimize(activeWindowId), 
        shortcut: '⌘M' 
      },
      { 
        label: 'Zoom', 
        action: () => activeWindowId && onMaximize(activeWindowId)
      },
      { separator: true },
      { label: 'Bring All to Front', action: () => {} },
    ],
    Help: [
      { 
        label: 'Portfolio Help', 
        action: () => window.open('https://github.com/yourusername/portfolio', '_blank') 
      },
      { separator: true },
      { 
        label: 'Contact Support...', 
        action: () => window.open('mailto:your.email@example.com', '_blank') 
      },
    ],
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-7 bg-gray-800/40 backdrop-blur-md border-b border-white/10 flex items-center px-4 z-50">
      <div className="flex items-center space-x-2">
        <span className="text-lg px-2">🍎</span>
      </div>
      {Object.entries(menuItems).map(([menu, items]) => (
        <div key={menu} className="relative">
          <button
            className={cn(
              "px-3 py-1 text-sm hover:bg-white/10 rounded",
              activeMenu === menu && "bg-white/10"
            )}
            onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
            onMouseEnter={() => activeMenu && setActiveMenu(menu)}
          >
            {menu}
          </button>

          {activeMenu === menu && (
            <div 
              className="absolute top-full left-0 mt-1 w-64 bg-gray-800/95 backdrop-blur-md rounded-lg shadow-xl border border-white/10"
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="py-1">
                {items.map((item, index) => (
                  item.separator ? (
                    <div key={index} className="h-px bg-white/10 my-1" />
                  ) : (
                    <button
                      key={index}
                      className="w-full px-4 py-1 text-left text-sm hover:bg-blue-500 flex justify-between items-center group"
                      onClick={() => {
                        item.action?.();
                        setActiveMenu(null);
                      }}
                    >
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <span className="text-gray-400 group-hover:text-white/70">{item.shortcut}</span>
                      )}
                    </button>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 
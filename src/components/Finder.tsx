import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  icon: string;
  content?: React.ReactNode;
  children?: FileItem[];
}

const fileSystem: FileItem[] = [
  {
    id: 'applications',
    name: 'Applications',
    type: 'folder',
    icon: '📁',
    children: [
      { id: 'about-me', name: 'AboutMe.exe', type: 'file', icon: '👤' },
      { id: 'education', name: 'Education.app', type: 'file', icon: '🎓' },
      { id: 'work-history', name: 'Work History.app', type: 'file', icon: '💼' },
      { id: 'projects', name: 'Projects.app', type: 'file', icon: '💻' },
      { id: 'skills', name: 'Skills.sys', type: 'file', icon: '🎯' },
      { id: 'terminal', name: 'Terminal.app', type: 'file', icon: '⌨️' },
    ]
  },
  {
    id: 'media',
    name: 'Media',
    type: 'folder',
    icon: '📁',
    children: [
      { id: 'movies', name: 'Movies.app', type: 'file', icon: '🎬' },
      { id: 'music', name: 'Music.app', type: 'file', icon: '🎵' },
      { id: 'gallery', name: 'Gallery.app', type: 'file', icon: '🖼️' },
      { id: 'books', name: 'Books.app', type: 'file', icon: '📚' },
    ]
  },
  {
    id: 'documents',
    name: 'Documents',
    type: 'folder',
    icon: '📁',
    children: [
      { id: 'about-site', name: 'About Site.txt', type: 'file', icon: 'ℹ️' },
      { id: 'cover-letter', name: 'Cover Letter.txt', type: 'file', icon: '✉️' },
      { id: 'contact', name: 'Contact.txt', type: 'file', icon: '📧' },
    ]
  },
  {
    id: 'system',
    name: 'System',
    type: 'folder',
    icon: '⚙️',
    children: [
      { 
        id: 'robots',
        name: 'robots.txt',
        type: 'file',
        icon: '🤖',
        content: (
          <div className="font-mono p-4 bg-gray-900 rounded-lg">
            <pre className="text-sm">
              {`User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml`}
            </pre>
          </div>
        )
      },
      {
        id: 'sitemap',
        name: 'sitemap.xml',
        type: 'file',
        icon: '🗺️',
        content: (
          <div className="font-mono p-4 bg-gray-900 rounded-lg">
            <pre className="text-sm">
              {`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`}
            </pre>
          </div>
        )
      },
      {
        id: 'manifest',
        name: 'manifest.json',
        type: 'file',
        icon: '📄',
        content: (
          <div className="font-mono p-4 bg-gray-900 rounded-lg">
            <pre className="text-sm">
              {`{
  "name": "Aditya's Portfolio",
  "short_name": "Portfolio",
  "description": "Personal portfolio showcasing my work and skills",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1f2937",
  "theme_color": "#1f2937",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}`}
            </pre>
          </div>
        )
      },
      {
        id: 'env',
        name: '.env',
        type: 'file',
        icon: '🔒',
        content: (
          <div className="font-mono p-4 bg-gray-900 rounded-lg">
            <pre className="text-sm">
              {`# Environment Variables
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# API Keys (redacted)
API_KEY=****************************
SECRET_KEY=**************************

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# Other Config
NODE_ENV=production
NEXT_PUBLIC_GA_ID=UA-XXXXXXXXX-X`}
            </pre>
          </div>
        )
      },
      {
        id: 'gitignore',
        name: '.gitignore',
        type: 'file',
        icon: '👁️',
        content: (
          <div className="font-mono p-4 bg-gray-900 rounded-lg">
            <pre className="text-sm">
              {`# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts`}
            </pre>
          </div>
        )
      }
    ]
  }
];

interface FinderProps {
  onOpenFile: (id: string) => void;
}

export function Finder({ onOpenFile }: FinderProps) {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const getCurrentFolder = () => {
    let current = fileSystem;
    for (const pathPart of currentPath) {
      const next = current.find(item => item.id === pathPart)?.children;
      if (!next) break;
      current = next;
    }
    return current;
  };

  const navigateToFolder = (folderId: string) => {
    const isRootFolder = fileSystem.some(item => item.id === folderId);
    if (isRootFolder) {
      setCurrentPath([folderId]);
    } else {
      setCurrentPath(prev => [...prev, folderId]);
    }
    setSelectedItem(null);
  };

  const navigateBack = () => {
    setCurrentPath(prev => prev.slice(0, -1));
    setSelectedItem(null);
  };

  const currentFolder = getCurrentFolder();

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-48 bg-gray-800/50 border-r border-gray-700/50">
        <div className="p-2 space-y-1">
          {fileSystem.map(item => (
            <button
              key={item.id}
              onClick={() => navigateToFolder(item.id)}
              className={cn(
                "w-full text-left px-3 py-1.5 rounded text-sm flex items-center gap-2",
                currentPath[0] === item.id ? "bg-blue-500/30" : "hover:bg-white/5"
              )}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-8 border-b border-gray-700/50 flex items-center px-2 gap-2">
          <button
            onClick={navigateBack}
            disabled={currentPath.length === 0}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-50"
          >
            ←
          </button>
          <div className="text-sm">
            {currentPath.length === 0 ? "Home" : currentPath.join(" / ")}
          </div>
        </div>

        {/* Files Grid - Updated with responsive classes */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {currentFolder.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.type === 'folder') {
                    navigateToFolder(item.id);
                  } else {
                    onOpenFile(item.id);
                  }
                  setSelectedItem(item.id);
                }}
                className={cn(
                  "p-2 rounded flex flex-col items-center gap-2 min-w-[100px]",
                  selectedItem === item.id ? "bg-blue-500/30" : "hover:bg-white/5"
                )}
              >
                <span className="text-3xl">{item.icon}</span>
                <span className="text-sm text-center break-words w-full">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
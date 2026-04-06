import {
  Mail,
  FolderOpen,
  FolderClosed,
  Briefcase,
  Film,
  BookOpen,
  Music,
  Palette,
  PlayCircle,
  Newspaper,
  Headphones,
  FileText,
} from "lucide-react";
import type { AppDefinition } from "@/components/desktop/types";

/**
 * Registry of all desktop apps.
 * Content is provided lazily — the actual component for each app
 * lives in src/components/apps/ and is imported in page.tsx.
 *
 * Icons use Lucide for consistency across the dock.
 */

export const APP_IDS = {
  COVER_LETTER: "cover-letter",
  PROJECTS: "projects",
  EXPERIENCE: "experience",
  MOVIES: "movies",
  BOOKS: "books",
  MUSIC: "music",
  GALLERY: "gallery",
  YOUTUBE: "youtube",
  NEWSLETTERS: "newsletters",
  PODCASTS: "podcasts",
  MEDIA: "media",
  CONTACT: "contact",
} as const;

/** Base definitions without content (content is composed in page.tsx) */
export const appMeta: Record<
  string,
  {
    title: string;
    icon: React.ReactNode;
    defaultSize: { width: number; height: number };
    hidden?: boolean;
  }
> = {
  [APP_IDS.COVER_LETTER]: {
    title: "A Letter",
    icon: <FileText size={22} strokeWidth={1.5} />,
    defaultSize: { width: 600, height: 520 },
  },
  [APP_IDS.PROJECTS]: {
    title: "Projects",
    icon: <FolderOpen size={22} strokeWidth={1.5} />,
    defaultSize: { width: 800, height: 560 },
  },
  [APP_IDS.EXPERIENCE]: {
    title: "Experience",
    icon: <Briefcase size={22} strokeWidth={1.5} />,
    defaultSize: { width: 720, height: 560 },
  },
  [APP_IDS.MOVIES]: {
    title: "Movies & Shows",
    icon: <Film size={22} strokeWidth={1.5} />,
    defaultSize: { width: 800, height: 560 },
    hidden: true,
  },
  [APP_IDS.BOOKS]: {
    title: "Books",
    icon: <BookOpen size={22} strokeWidth={1.5} />,
    defaultSize: { width: 720, height: 560 },
    hidden: true,
  },
  [APP_IDS.MUSIC]: {
    title: "Music",
    icon: <Music size={22} strokeWidth={1.5} />,
    defaultSize: { width: 720, height: 520 },
    hidden: true,
  },
  [APP_IDS.GALLERY]: {
    title: "Gallery",
    icon: <Palette size={22} strokeWidth={1.5} />,
    defaultSize: { width: 760, height: 560 },
    hidden: true,
  },
  [APP_IDS.YOUTUBE]: {
    title: "YouTube",
    icon: <PlayCircle size={22} strokeWidth={1.5} />,
    defaultSize: { width: 760, height: 560 },
    hidden: true,
  },
  [APP_IDS.NEWSLETTERS]: {
    title: "Newsletters",
    icon: <Newspaper size={22} strokeWidth={1.5} />,
    defaultSize: { width: 640, height: 480 },
    hidden: true,
  },
  [APP_IDS.PODCASTS]: {
    title: "Podcasts",
    icon: <Headphones size={22} strokeWidth={1.5} />,
    defaultSize: { width: 640, height: 520 },
    hidden: true,
  },
  [APP_IDS.MEDIA]: {
    title: "My Media Consumption",
    icon: <FolderClosed size={22} strokeWidth={1.5} />,
    defaultSize: { width: 560, height: 420 },
  },
  [APP_IDS.CONTACT]: {
    title: "Contact",
    icon: <Mail size={22} strokeWidth={1.5} />,
    defaultSize: { width: 480, height: 400 },
  },
};

/** Helper to build a full AppDefinition from meta + content */
export function buildApp(id: string, content: React.ReactNode): AppDefinition {
  const meta = appMeta[id];
  if (!meta) throw new Error(`Unknown app id: ${id}`);
  const { hidden, ...rest } = meta;
  return { id, ...rest, content, ...(hidden && { hidden }) };
}

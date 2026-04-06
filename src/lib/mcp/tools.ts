import { siteConfig, socialLinks } from "@/data/personal";
import { workExperience } from "@/data/experience";
import { projects, CATEGORY_LABELS } from "@/data/projects";
import {
  coverLetterParagraphs,
  coverLetterClosing,
  coverLetterPostscript,
} from "@/data/cover-letter";
import { books } from "@/data/media/books";
import { movies } from "@/data/media/movies";
import { playlists } from "@/data/media/music";
import { artworks } from "@/data/media/artworks";
import { podcasts } from "@/data/media/podcasts";
import { newsletters } from "@/data/media/newsletters";
import { youtubeChannels } from "@/data/media/youtube";

// ── Section names ──────────────────────────────────────────────────────

export const SECTION_NAMES = [
  "experience",
  "projects",
  "cover-letter",
  "contact",
  "books",
  "movies",
  "music",
  "artworks",
  "podcasts",
  "newsletters",
  "youtube",
] as const;

export type SectionName = (typeof SECTION_NAMES)[number];

// ── Tool 1: get_portfolio_overview ─────────────────────────────────────

export function getPortfolioOverview() {
  const totalSongs = playlists.reduce((sum, p) => sum + p.songs.length, 0);
  const totalChannels = youtubeChannels.reduce((sum, c) => sum + c.channels.length, 0);

  return {
    name: siteConfig.name,
    title: siteConfig.title,
    company: siteConfig.company,
    location: siteConfig.location,
    url: siteConfig.url,
    social: {
      github: socialLinks.github,
      linkedin: socialLinks.linkedin,
      email: siteConfig.email,
    },
    sections: [
      { name: "experience", description: "Work history", count: workExperience.length },
      {
        name: "projects",
        description: "Portfolio projects",
        count: projects.length,
        filters: { category: Object.keys(CATEGORY_LABELS).filter((k) => k !== "all") },
      },
      { name: "cover-letter", description: "Personal cover letter" },
      { name: "contact", description: "Contact information and social links" },
      {
        name: "books",
        description: "Reading library",
        count: books.length,
        filters: { status: ["favorites", "reading", "want-to-read"] },
      },
      {
        name: "movies",
        description: "Movies and TV series",
        count: movies.length,
        filters: { type: ["movie", "series"] },
      },
      { name: "music", description: "Music playlists", count: totalSongs },
      { name: "artworks", description: "Favorite artworks", count: artworks.length },
      { name: "podcasts", description: "Podcast subscriptions", count: podcasts.length },
      {
        name: "newsletters",
        description: "Newsletter subscriptions",
        count: newsletters.length,
      },
      {
        name: "youtube",
        description: "YouTube channels by category",
        count: totalChannels,
      },
    ],
  };
}

// ── Tool 2: get_section ────────────────────────────────────────────────

interface SectionFilters {
  category?: string;
  status?: string;
  type?: string;
}

export function getSection(section: string, filters?: SectionFilters) {
  switch (section) {
    case "experience":
      return { section: "experience", data: workExperience };

    case "projects": {
      const filtered = filters?.category
        ? projects.filter((p) => p.category === filters.category)
        : projects;
      return { section: "projects", count: filtered.length, data: filtered };
    }

    case "cover-letter":
      return {
        section: "cover-letter",
        data: {
          paragraphs: coverLetterParagraphs,
          closing: coverLetterClosing,
          postscript: coverLetterPostscript,
        },
      };

    case "contact":
      return {
        section: "contact",
        data: {
          name: siteConfig.name,
          email: siteConfig.email,
          phone: siteConfig.phone,
          location: siteConfig.location,
          social: {
            github: socialLinks.github,
            linkedin: socialLinks.linkedin,
          },
        },
      };

    case "books": {
      const filtered = filters?.status
        ? books.filter((b) => b.status === filters.status)
        : books;
      return { section: "books", count: filtered.length, data: filtered };
    }

    case "movies": {
      const filtered = filters?.type
        ? movies.filter((m) => m.type === filters.type)
        : movies;
      return { section: "movies", count: filtered.length, data: filtered };
    }

    case "music":
      return { section: "music", data: playlists };

    case "artworks":
      return { section: "artworks", data: artworks };

    case "podcasts":
      return { section: "podcasts", data: podcasts };

    case "newsletters":
      return { section: "newsletters", data: newsletters };

    case "youtube":
      return { section: "youtube", data: youtubeChannels };

    default:
      return {
        error: `Unknown section "${section}". Valid sections: ${SECTION_NAMES.join(", ")}`,
      };
  }
}

// ── Tool 3: search_portfolio ───────────────────────────────────────────

interface SearchEntry {
  section: string;
  title: string;
  text: string;
  data: Record<string, unknown>;
}

function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const exp of workExperience) {
    for (const role of exp.roles) {
      entries.push({
        section: "experience",
        title: `${role.title} at ${exp.company}`,
        text: [
          exp.company,
          role.title,
          role.period,
          ...role.bullets,
          ...(role.technologies ?? []),
        ]
          .join(" ")
          .toLowerCase(),
        data: {
          company: exp.company,
          role: role.title,
          period: role.period,
          bullets: role.bullets,
          technologies: role.technologies,
        } as Record<string, unknown>,
      });
    }
  }

  for (const p of projects) {
    entries.push({
      section: "projects",
      title: p.title,
      text: [p.title, p.description, p.category, ...p.tech, p.badge ?? ""]
        .join(" ")
        .toLowerCase(),
      data: p as unknown as Record<string, unknown>,
    });
  }

  for (const b of books) {
    entries.push({
      section: "books",
      title: b.title,
      text: [b.title, b.author, ...b.genre, b.status].join(" ").toLowerCase(),
      data: b as unknown as Record<string, unknown>,
    });
  }

  for (const m of movies) {
    entries.push({
      section: "movies",
      title: m.title,
      text: [m.title, m.description, ...m.genre, m.type].join(" ").toLowerCase(),
      data: {
        title: m.title,
        year: m.year,
        genre: m.genre,
        type: m.type,
        rating: m.rating,
      } as Record<string, unknown>,
    });
  }

  for (const pl of playlists) {
    for (const s of pl.songs) {
      entries.push({
        section: "music",
        title: `${s.title} — ${s.artist}`,
        text: [s.title, s.artist, pl.name].join(" ").toLowerCase(),
        data: { playlist: pl.name, title: s.title, artist: s.artist } as Record<
          string,
          unknown
        >,
      });
    }
  }

  for (const a of artworks) {
    entries.push({
      section: "artworks",
      title: a.title,
      text: [a.title, a.artist, a.movement, a.year].join(" ").toLowerCase(),
      data: {
        title: a.title,
        artist: a.artist,
        year: a.year,
        movement: a.movement,
      } as Record<string, unknown>,
    });
  }

  for (const p of podcasts) {
    entries.push({
      section: "podcasts",
      title: p.name,
      text: p.name.toLowerCase(),
      data: p as unknown as Record<string, unknown>,
    });
  }

  for (const n of newsletters) {
    entries.push({
      section: "newsletters",
      title: n.name,
      text: n.name.toLowerCase(),
      data: n as unknown as Record<string, unknown>,
    });
  }

  for (const cat of youtubeChannels) {
    for (const ch of cat.channels) {
      entries.push({
        section: "youtube",
        title: ch,
        text: [ch, cat.category].join(" ").toLowerCase(),
        data: { channel: ch, category: cat.category } as Record<string, unknown>,
      });
    }
  }

  return entries;
}

const searchIndex = buildSearchIndex();

export function searchPortfolio(query: string, limit = 10) {
  const maxLimit = Math.min(limit, 50);
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return { results: [], count: 0 };
  }

  const matches = searchIndex.filter((entry) =>
    tokens.every((token) => entry.text.includes(token)),
  );

  return {
    query,
    count: matches.length,
    results: matches.slice(0, maxLimit).map(({ section, title, data }) => ({
      section,
      title,
      data,
    })),
  };
}

"use client";

import { useEffect } from "react";
import {
  getPortfolioOverview,
  getSection,
  searchPortfolio,
  SECTION_NAMES,
  BOOK_STATUSES,
  MOVIE_TYPES,
} from "@/lib/mcp/tools";
import { PROJECT_TAGS } from "@/data/projects";

// The published @mcp-b/webmcp-types global types model `registerTool` with heavily
// overloaded generics tuned for literal schema inference. We only need the loose
// structural shape, so we describe it locally and reach it through a cast. This also
// keeps the component working whether the API comes from a native browser or the
// polyfill, without depending on the ambient global declaration being loaded.
type WebMcpToolResult = { content: { type: "text"; text: string }[] };

interface WebMcpTool {
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean; openWorldHint?: boolean };
  execute: (args: Record<string, unknown>) => Promise<WebMcpToolResult>;
}

interface WebMcpModelContext {
  registerTool: (tool: WebMcpTool, options?: { signal?: AbortSignal }) => void;
}

function asToolResult(value: unknown): WebMcpToolResult {
  return { content: [{ type: "text", text: JSON.stringify(value) }] };
}

const READ_ONLY = { readOnlyHint: true, openWorldHint: false } as const;

const portfolioTools: WebMcpTool[] = [
  {
    name: "get_portfolio_overview",
    description:
      "Get a high-level overview of Adi Perswal's portfolio including name, title, company, social links, and a manifest of all queryable sections with item counts. Call this first to discover what data is available.",
    annotations: READ_ONLY,
    execute: async () => asToolResult(getPortfolioOverview()),
  },
  {
    name: "get_section",
    description: `Get detailed data for a specific portfolio section. Sections: ${SECTION_NAMES.join(", ")}. Optional filters: 'category' tags projects (${PROJECT_TAGS.join(", ")}) — a project may match several; 'status' filters books (${BOOK_STATUSES.join(", ")}); 'type' filters movies (${MOVIE_TYPES.join(", ")}).`,
    inputSchema: {
      type: "object",
      properties: {
        section: {
          type: "string",
          enum: [...SECTION_NAMES],
          description: "The section to retrieve",
        },
        category: {
          type: "string",
          enum: [...PROJECT_TAGS],
          description: "Filter projects by tag (a project may have several)",
        },
        status: {
          type: "string",
          enum: [...BOOK_STATUSES],
          description: "Filter books by reading status",
        },
        type: {
          type: "string",
          enum: [...MOVIE_TYPES],
          description: "Filter movies by type",
        },
      },
      required: ["section"],
    },
    annotations: READ_ONLY,
    execute: async (args) =>
      asToolResult(
        getSection(String(args.section), {
          category: typeof args.category === "string" ? args.category : undefined,
          status: typeof args.status === "string" ? args.status : undefined,
          type: typeof args.type === "string" ? args.type : undefined,
        }),
      ),
  },
  {
    name: "search_portfolio",
    description:
      "Search across all portfolio content (projects, experience, books, movies, music, artworks, podcasts, newsletters, YouTube channels) by keyword. Returns matching items grouped by section.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search term (case-insensitive)" },
        limit: {
          type: "number",
          description: "Max results to return (default 10, max 50)",
        },
      },
      required: ["query"],
    },
    annotations: READ_ONLY,
    execute: async (args) =>
      asToolResult(
        searchPortfolio(
          String(args.query),
          typeof args.limit === "number" ? args.limit : undefined,
        ),
      ),
  },
];

/**
 * Registers the portfolio's tools on the W3C WebMCP browser API
 * (navigator.modelContext) so in-browser AI agents can query it directly. The same
 * tool logic backs the remote MCP server at /api/mcp, so both share one source of
 * truth in src/lib/mcp/tools.ts. No-ops cleanly where the API is unavailable.
 */
export function WebMcpProvider() {
  useEffect(() => {
    if (typeof navigator === "undefined") return;

    const controller = new AbortController();
    let cancelled = false;

    void (async () => {
      // Loaded only in the browser: the polyfill touches `navigator`/`window` at
      // import time and installs navigator.modelContext where it is missing.
      try {
        await import("@mcp-b/webmcp-polyfill");
      } catch {
        return;
      }
      if (cancelled) return;

      const modelContext = (navigator as unknown as { modelContext?: WebMcpModelContext })
        .modelContext;
      if (!modelContext) return;

      for (const tool of portfolioTools) {
        modelContext.registerTool(tool, { signal: controller.signal });
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return null;
}

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  getPortfolioOverview,
  getSection,
  searchPortfolio,
  SECTION_NAMES,
} from "./tools";

export function createPortfolioMcpServer(): McpServer {
  const server = new McpServer({
    name: "adi-perswal-portfolio",
    version: "1.0.0",
  });

  server.tool(
    "get_portfolio_overview",
    "Get a high-level overview of Adi Perswal's portfolio including name, title, company, social links, and a manifest of all queryable sections with item counts. Call this first to discover what data is available.",
    async () => ({
      content: [{ type: "text" as const, text: JSON.stringify(getPortfolioOverview()) }],
    }),
  );

  server.tool(
    "get_section",
    `Get detailed data for a specific portfolio section. Sections: ${SECTION_NAMES.join(", ")}. Supports optional filters: 'category' for projects (featured, tool, web-app, extension, ai-ml), 'status' for books (favorites, reading, want-to-read), 'type' for movies (movie, series).`,
    {
      section: z.enum(SECTION_NAMES).describe("The section to retrieve"),
      category: z.string().optional().describe("Filter projects by category"),
      status: z.string().optional().describe("Filter books by reading status"),
      type: z.string().optional().describe("Filter movies by type (movie or series)"),
    },
    async ({ section, category, status, type }) => ({
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(getSection(section, { category, status, type })),
        },
      ],
    }),
  );

  server.tool(
    "search_portfolio",
    "Search across all portfolio content (projects, experience, books, movies, music, artworks, podcasts, newsletters, YouTube channels) by keyword. Returns matching items grouped by section.",
    {
      query: z.string().describe("Search term (case-insensitive)"),
      limit: z.number().optional().describe("Max results to return (default 10, max 50)"),
    },
    async ({ query, limit }) => ({
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(searchPortfolio(query, limit)),
        },
      ],
    }),
  );

  return server;
}

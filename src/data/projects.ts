/**
 * Controlled vocabulary of project tags. A project can carry several (it is a
 * multi-faceted thing — e.g. PhD for Dummies is a web app AND ai-ml AND
 * education). "featured" is intentionally NOT a tag — it is a separate curation
 * flag, so a project can be both featured and correctly typed.
 */
export const PROJECT_TAGS = [
  "web-app",
  "tool",
  "extension",
  "ai-ml",
  "mobile",
  "game",
  "education",
] as const;

export type ProjectTag = (typeof PROJECT_TAGS)[number];

export interface Project {
  title: string;
  description: string;
  /** Curation flag — highlighted projects, orthogonal to `tags`. */
  featured: boolean;
  /** What kind of thing this is; one project may legitimately have several. */
  tags: ProjectTag[];
  tech: string[];
  link: string;
  badge?: string;
}

/** Human labels for each tag (filter chips, MCP). */
export const TAG_LABELS: Record<ProjectTag, string> = {
  "web-app": "Web Apps",
  tool: "Tools",
  extension: "Extensions",
  "ai-ml": "AI / ML",
  mobile: "Mobile",
  game: "Games",
  education: "Education",
};

export const projects: Project[] = [
  // ── Featured ──────────────────────────────────────────────────────────
  {
    title: "Coding by Hand",
    description:
      'A course that teaches Python and deep learning from scratch — from print("hello") to a transformer built by hand in pure Python — for someone who has never written a line of code, with a parallel Rust track that goes all the way down to computer architecture. Every lesson pairs one running analogy, a beat of history, code you type and run yourself, and a textbook-style diagram. Built on the belief that learning to code is about thinking logically and understanding the real limits of computers, not memorizing syntax.',
    featured: true,
    tags: ["web-app", "education", "ai-ml"],
    tech: ["TypeScript", "Next.js", "MDX", "Tailwind CSS", "Rust", "Zod"],
    link: "https://codingbyhand.com",
    badge: "Live",
  },
  {
    title: "Prose",
    description:
      "A minimalist iOS writing app with a live Hemingway-style editor: your readability grade updates as you type, and one toggle highlights long sentences, passive voice, adverbs, inflated vocabulary, and filler words right where you wrote them. Fast like Apple Notes, clean like Notion, and deliberately free of AI, cloud, and accounts — your half-formed ideas stay on device and get better over time, like wine.",
    featured: true,
    tags: ["mobile"],
    tech: ["Swift", "SwiftUI", "SwiftData", "NaturalLanguage"],
    link: "https://github.com/aperswal/Prose",
    badge: "iOS App",
  },
  {
    title: "Prose-Agent",
    description:
      "The Prose engine from my iOS writing app, turned into a deterministic API that a coding agent loops on. An agent sends a markdown draft and gets back exactly what to fix and where: the long sentence, the inflated word with its plain replacement, the spot in the source. It applies the edits and sends the draft again, until the verdict comes back clean. There is no model behind it, so the same draft always returns the same notes, and an agent can lean on it without the answer drifting. It connects over MCP, so any agent picks up the tool from one URL, and the whole thing runs on a single Cloudflare Worker.",
    featured: true,
    tags: ["tool"],
    tech: ["TypeScript", "Cloudflare Workers", "MCP", "Zod", "mdast", "Vitest"],
    link: "https://github.com/aperswal/Prose-Agent",
    badge: "MCP Server",
  },
  {
    title: "PhD for Dummies",
    description:
      "Famous AI/ML/RL papers explained in layers, each with diagrams and a live simulation you can reach in and break. I built it because I wanted to keep up with the field but had never learned to read a paper — I'd hit a wall of symbols on page one and close it. Every paper climbs from a version a five-year-old could follow up to the one a peer researcher would argue with, and the demo runs the paper's real rules, so you learn the mechanism by poking it rather than watching a cartoon of it. Under the hood a chain of Claude skills does the work — thinking, writing the layers, building and reviewing the simulations, writing tests, generating diagrams, converting them to WebP and pushing them to blob storage — so a paper goes from PDF to something I actually understand before I write a line of implementation.",
    featured: true,
    tags: ["web-app", "ai-ml", "education"],
    tech: [
      "TypeScript",
      "Next.js",
      "MDX",
      "Tailwind CSS",
      "Claude Skills",
      "Vercel Blob",
    ],
    link: "https://phdfordummies.com",
    badge: "Live",
  },
  {
    title: "AutoDocs",
    description:
      "Open-source documentation engine that parses any repo's AST with tree-sitter and SCIP, builds a dependency graph, and walks it to generate accurate, dependency-aware docs. Ships with a built-in MCP server so coding agents can deep-search your code via HTTP.",
    featured: true,
    tags: ["tool", "ai-ml"],
    tech: [
      "Python",
      "FastAPI",
      "TypeScript",
      "Next.js",
      "Docker",
      "tree-sitter",
      "SCIP",
      "PostgreSQL",
    ],
    link: "https://github.com/TrySita/AutoDocs",
    badge: "195 stars",
  },
  {
    title: "Motus",
    description:
      "Finds the cheapest set of flights that land a whole group in one place within the same arrival window. Each traveler lists the airports they can fly from, and Motus picks one flight per person so everyone arrives within an hour or two of each other while the group pays as little as possible. Every price is all-in, folding each person's checked and carry-on bag fees into the fare so a cheap basic fare competes fairly with a bags-included one. It runs on live RouteStack fares and ships its own Code-Mode MCP server, so an AI agent can run group searches by writing small snippets of code against a sandboxed SDK.",
    featured: true,
    tags: ["web-app", "tool"],
    tech: [
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "TanStack Query",
      "Zustand",
      "Zod",
      "MCP",
    ],
    link: "https://motus-sable.vercel.app",
    badge: "Live",
  },
  {
    title: "Personal Portfolio",
    description:
      "Interactive portfolio website designed to mimic the macOS desktop experience, featuring draggable windows, functional dock, and realistic desktop environment.",
    featured: true,
    tags: ["web-app"],
    tech: ["TypeScript", "React", "Next.js", "TailwindCSS"],
    link: "https://github.com/aperswal/Personal-Portfolio",
  },
  {
    title: "HyppoHealth",
    description:
      "A platform reshaping how Americans navigate healthcare with free tools and expert-backed resources for understanding and optimizing healthcare costs. Features include insurance comparison tools, cost calculators, and comprehensive educational resources.",
    featured: true,
    tags: ["web-app"],
    tech: ["Web Development", "Healthcare Systems", "UI/UX Design"],
    link: "https://hyppohealth.com/",
  },
  {
    title: "CloudFormation To Terraform",
    description:
      "Popular open-source tool that converts AWS CloudFormation templates to Terraform configurations with both web and CLI interfaces. Features include multi-file support, state file generation, security analysis, and documentation generation.",
    featured: true,
    tags: ["tool"],
    tech: ["Python", "Flask", "AWS", "Terraform"],
    link: "https://github.com/aperswal/CloudFormation_To_Terraform",
    badge: "42 stars",
  },
  {
    title: "Quick Transcriber",
    description:
      "Real-time speech-to-text application that locally transcribes your voice and types it at cursor position, with no internet required. Features always-on-top monitoring window and global keyboard shortcuts.",
    featured: true,
    tags: ["tool", "ai-ml"],
    tech: ["Python", "Vosk", "PyQt6", "SoundDevice"],
    link: "https://github.com/aperswal/quick-transcriber",
  },

  // ── E-Commerce Tools ──────────────────────────────────────────────────
  {
    title: "Pricing Optimizer",
    description:
      "Calculates the price that maximizes profit per SKU using competitor data, customer willingness-to-pay curves, and elasticity math.",
    featured: false,
    tags: ["tool"],
    tech: ["Analytics", "E-Commerce"],
    link: "https://save10hours.com",
  },
  {
    title: "High-Value Customer Finder",
    description:
      "Identifies the audience segment that values your product at 30-50% higher prices, with their pain points, hangouts, and the exact words they use.",
    featured: false,
    tags: ["tool"],
    tech: ["Market Research", "E-Commerce"],
    link: "https://save10hours.com",
  },
  {
    title: "Creator ROI Screener",
    description:
      "Vets influencers by real engagement rates, past conversion results, fees, and whether they'll be profitable at your margins.",
    featured: false,
    tags: ["tool"],
    tech: ["Analytics", "Social Media"],
    link: "https://save10hours.com",
  },
  {
    title: "3PL Cost Comparison",
    description:
      "Ranks third-party logistics providers by actual landed cost based on your products, volumes, and customer geography.",
    featured: false,
    tags: ["tool"],
    tech: ["Logistics", "E-Commerce"],
    link: "https://save10hours.com",
  },
  {
    title: "Manufacturer Matcher",
    description:
      "Matches suppliers to your volume, quality requirements, and payment terms with verified reviews and real lead times.",
    featured: false,
    tags: ["tool"],
    tech: ["Supply Chain", "E-Commerce"],
    link: "https://save10hours.com",
  },
  {
    title: "Inventory Reorder Calculator",
    description:
      "Generates exact reorder quantities and a month-by-month PO schedule based on sales velocity, seasonality, and supplier lead times.",
    featured: false,
    tags: ["tool"],
    tech: ["Inventory Management", "E-Commerce"],
    link: "https://save10hours.com",
  },
  {
    title: "Support Root Cause Analyzer",
    description:
      "Finds the 3-5 root causes generating most of your support tickets and gives specific fixes that eliminate them at the source.",
    featured: false,
    tags: ["tool"],
    tech: ["Customer Support", "Analytics"],
    link: "https://save10hours.com",
  },
  {
    title: "Automation Blueprint Builder",
    description:
      "Turns a manual process description into a Zapier/Make-ready playbook with triggers, actions, filters, and field mappings.",
    featured: false,
    tags: ["tool"],
    tech: ["Automation", "Zapier", "Make"],
    link: "https://save10hours.com",
  },

  // ── Web Applications ──────────────────────────────────────────────────
  {
    title: "Email Verifier API",
    description:
      "Serverless email verification service built on AWS Lambda that validates emails through syntax checks, disposable email detection, MX record verification, and SMTP checking via AWS SES, with response caching in DynamoDB.",
    featured: false,
    tags: ["web-app", "tool"],
    tech: ["JavaScript", "Node.js", "AWS Lambda", "DynamoDB", "SES"],
    link: "https://github.com/aperswal/Email-Verifier-API",
  },
  {
    title: "Leads List Cleaner",
    description:
      "Web application that leverages the Email Verifier API to process marketing lead lists, detect invalid or disposable email addresses, and improve overall campaign deliverability and effectiveness.",
    featured: false,
    tags: ["web-app", "tool"],
    tech: ["TypeScript", "React", "AWS Integration"],
    link: "https://github.com/aperswal/Leads-List-Cleaner",
  },
  {
    title: "Social Media Poster",
    description:
      "Automation tool for scheduling and posting content across multiple social media platforms with analytics tracking.",
    featured: false,
    tags: ["web-app", "tool"],
    tech: ["TypeScript", "Social APIs"],
    link: "https://github.com/aperswal/social-media-poster",
  },
  {
    title: "WordFillWithFriends",
    description:
      "Multiplayer Wordle-style word guessing game with competitive tier progression (Bronze to Diamond), global leaderboards, friend challenges, and customizable profiles with real-time updates.",
    featured: false,
    tags: ["web-app", "game"],
    tech: ["TypeScript", "React", "Firebase", "TailwindCSS"],
    link: "https://github.com/aperswal/WordFillWithFriends",
  },
  {
    title: "Figma Clone",
    description:
      "Fully-functional Figma clone with real-time collaboration features including multi-cursors, cursor chat, reactions, and comments. Supports shape creation, image upload, freeform drawing, element customization, and full history with undo/redo functionality.",
    featured: false,
    tags: ["web-app"],
    tech: ["TypeScript", "Next.js", "Fabric.js", "Liveblocks", "Tailwind CSS"],
    link: "https://github.com/aperswal/Figma_Clone",
  },
  {
    title: "Google Drive Clone",
    description:
      "File storage and sharing platform built to store blog posts from content-generator for freelance clients. Features file upload, organization, and sharing functionality similar to Google Drive.",
    featured: false,
    tags: ["web-app"],
    tech: ["JavaScript", "React", "Firebase", "Firestore", "Authentication"],
    link: "https://github.com/aperswal/Google-Drive-Clone",
  },
  {
    title: "Notepad Clone",
    description:
      "Desktop text editor application built as a first foray into desktop software development. Features standard text editing capabilities, file operations, and a customizable interface inspired by Microsoft Notepad.",
    featured: false,
    tags: ["tool"],
    tech: ["Java", "Java Extended Library", "Java IO", "AWT", "Spring"],
    link: "https://github.com/aperswal/notepad_clone",
  },
  {
    title: "Crossy Road Clone",
    description:
      "Recreation of the popular Crossy Road game with similar mechanics, obstacles, and character movement.",
    featured: false,
    tags: ["game", "web-app"],
    tech: ["JavaScript", "Canvas API"],
    link: "https://github.com/aperswal/Crossy_Road_Clone",
  },
  {
    title: "Productivity Manager",
    description:
      "Integration tool that extracts tasks from Notion databases and automatically block schedules them into Google Calendar, creating a streamlined workflow for time management and deadline tracking.",
    featured: false,
    tags: ["tool"],
    tech: ["Python", "Notion API", "Google Calendar API"],
    link: "https://github.com/aperswal/Productivity-Manager",
  },
  {
    title: "Options Contract Pricing",
    description:
      "Advanced financial analytics platform for options traders with four specialized modules. Features include Black-Scholes modeling, Monte Carlo simulations, SABR volatility modeling, sentiment analysis from institutional trading data and Reddit, and mispriced contract identification through a public API.",
    featured: false,
    tags: ["web-app", "tool"],
    tech: [
      "Python",
      "AWS Lambda",
      "API Gateway",
      "Black-Scholes",
      "Monte Carlo",
      "SABR",
      "Reddit API",
    ],
    link: "https://github.com/aperswal/Options-Toolkit",
  },

  // ── Chrome Extensions ─────────────────────────────────────────────────
  {
    title: "Skool Sentiment Analysis",
    description:
      "Chrome extension that analyzes text on Skool.com, identifying frequently used phrases and assessing overall sentiment (from Super Negative to Super Positive) to help users gauge the mood of discussions. Processes text directly in the browser for privacy.",
    featured: false,
    tags: ["extension", "ai-ml"],
    tech: ["JavaScript", "HTML", "CSS", "Chrome API"],
    link: "https://github.com/aperswal/Skool_Sentiment_Analysis_Chrome_Extension",
  },
  {
    title: "Skool Active Members",
    description:
      "Chrome extension that creates a leaderboard of the most active participants in Skool communities, helping admins and members identify key contributors. Core functionality uses proprietary algorithms to track engagement metrics.",
    featured: false,
    tags: ["extension"],
    tech: ["JavaScript", "HTML", "CSS", "Chrome API"],
    link: "https://github.com/aperswal/Skool_Active_Members_Chrome_Extension",
  },
  {
    title: "Skool Inactive Members",
    description:
      "Chrome extension that automatically scans Skool communities to identify members inactive for over 30 days. Features automated page navigation, data extraction of member profiles, and CSV export functionality for easy re-engagement outreach.",
    featured: false,
    tags: ["extension"],
    tech: ["JavaScript", "HTML", "Chrome API", "Manifest v3"],
    link: "https://github.com/aperswal/Skool_Inactive_Members_Chrome_Extension",
  },

  // ── AI / ML ───────────────────────────────────────────────────────────
  {
    title: "Diabetes Heart Parkinsons Predictor",
    description:
      "Web application with multiple machine learning models to predict Diabetes, Heart Disease, and Parkinson's from patient data. Includes pre-trained models stored in the application for immediate predictions via an interactive Streamlit interface.",
    featured: false,
    tags: ["ai-ml", "web-app"],
    tech: ["Python", "Jupyter Notebook", "Streamlit", "Machine Learning"],
    link: "https://github.com/aperswal/Diabetes_Hear_Parkinsons_Predictor",
  },
  {
    title: "Content Generator",
    description:
      "AI SEO Blog Generator that creates optimized content using OpenAI's GPT model and sources relevant images via Pexels API. Features AIDA and PAS copywriting frameworks, keyword optimization, and customizable blog structures.",
    featured: false,
    tags: ["ai-ml", "tool"],
    tech: ["Python", "OpenAI API", "Pexels API", "Flask"],
    link: "https://github.com/aperswal/Content-Generator",
  },
];

export type ProjectCategory = "featured" | "tool" | "web-app" | "extension" | "ai-ml";

export interface Project {
  title: string;
  description: string;
  category: ProjectCategory;
  tech: string[];
  link: string;
  badge?: string;
}

export const CATEGORY_LABELS: Record<ProjectCategory | "all", string> = {
  all: "All",
  featured: "Featured",
  tool: "Tools",
  "web-app": "Web Apps",
  extension: "Extensions",
  "ai-ml": "AI / ML",
};

export const projects: Project[] = [
  // ── Featured ──���───────────────────────────────────────────────────────
  {
    title: "AutoDocs",
    description:
      "Open-source documentation engine that parses any repo's AST with tree-sitter and SCIP, builds a dependency graph, and walks it to generate accurate, dependency-aware docs. Ships with a built-in MCP server so coding agents can deep-search your code via HTTP.",
    category: "featured",
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
    title: "Personal Portfolio",
    description:
      "Interactive portfolio website designed to mimic the macOS desktop experience, featuring draggable windows, functional dock, and realistic desktop environment.",
    category: "featured",
    tech: ["TypeScript", "React", "Next.js", "TailwindCSS"],
    link: "https://github.com/aperswal/Personal-Portfolio",
  },
  {
    title: "HyppoHealth",
    description:
      "A platform reshaping how Americans navigate healthcare with free tools and expert-backed resources for understanding and optimizing healthcare costs. Features include insurance comparison tools, cost calculators, and comprehensive educational resources.",
    category: "featured",
    tech: ["Web Development", "Healthcare Systems", "UI/UX Design"],
    link: "https://hyppohealth.com/",
  },
  {
    title: "CloudFormation To Terraform",
    description:
      "Popular open-source tool that converts AWS CloudFormation templates to Terraform configurations with both web and CLI interfaces. Features include multi-file support, state file generation, security analysis, and documentation generation.",
    category: "featured",
    tech: ["Python", "Flask", "AWS", "Terraform"],
    link: "https://github.com/aperswal/CloudFormation_To_Terraform",
    badge: "42 stars",
  },
  {
    title: "Quick Transcriber",
    description:
      "Real-time speech-to-text application that locally transcribes your voice and types it at cursor position, with no internet required. Features always-on-top monitoring window and global keyboard shortcuts.",
    category: "featured",
    tech: ["Python", "Vosk", "PyQt6", "SoundDevice"],
    link: "https://github.com/aperswal/quick-transcriber",
  },

  // ── E-Commerce Tools ──────────────────────────────────────────────────
  {
    title: "Pricing Optimizer",
    description:
      "Calculates the price that maximizes profit per SKU using competitor data, customer willingness-to-pay curves, and elasticity math.",
    category: "tool",
    tech: ["Analytics", "E-Commerce"],
    link: "https://save10hours.com",
  },
  {
    title: "High-Value Customer Finder",
    description:
      "Identifies the audience segment that values your product at 30-50% higher prices, with their pain points, hangouts, and the exact words they use.",
    category: "tool",
    tech: ["Market Research", "E-Commerce"],
    link: "https://save10hours.com",
  },
  {
    title: "Creator ROI Screener",
    description:
      "Vets influencers by real engagement rates, past conversion results, fees, and whether they'll be profitable at your margins.",
    category: "tool",
    tech: ["Analytics", "Social Media"],
    link: "https://save10hours.com",
  },
  {
    title: "3PL Cost Comparison",
    description:
      "Ranks third-party logistics providers by actual landed cost based on your products, volumes, and customer geography.",
    category: "tool",
    tech: ["Logistics", "E-Commerce"],
    link: "https://save10hours.com",
  },
  {
    title: "Manufacturer Matcher",
    description:
      "Matches suppliers to your volume, quality requirements, and payment terms with verified reviews and real lead times.",
    category: "tool",
    tech: ["Supply Chain", "E-Commerce"],
    link: "https://save10hours.com",
  },
  {
    title: "Inventory Reorder Calculator",
    description:
      "Generates exact reorder quantities and a month-by-month PO schedule based on sales velocity, seasonality, and supplier lead times.",
    category: "tool",
    tech: ["Inventory Management", "E-Commerce"],
    link: "https://save10hours.com",
  },
  {
    title: "Support Root Cause Analyzer",
    description:
      "Finds the 3-5 root causes generating most of your support tickets and gives specific fixes that eliminate them at the source.",
    category: "tool",
    tech: ["Customer Support", "Analytics"],
    link: "https://save10hours.com",
  },
  {
    title: "Automation Blueprint Builder",
    description:
      "Turns a manual process description into a Zapier/Make-ready playbook with triggers, actions, filters, and field mappings.",
    category: "tool",
    tech: ["Automation", "Zapier", "Make"],
    link: "https://save10hours.com",
  },

  // ── Web Applications ──────��───────────────────────────────────────────
  {
    title: "Email Verifier API",
    description:
      "Serverless email verification service built on AWS Lambda that validates emails through syntax checks, disposable email detection, MX record verification, and SMTP checking via AWS SES, with response caching in DynamoDB.",
    category: "web-app",
    tech: ["JavaScript", "Node.js", "AWS Lambda", "DynamoDB", "SES"],
    link: "https://github.com/aperswal/Email-Verifier-API",
  },
  {
    title: "Leads List Cleaner",
    description:
      "Web application that leverages the Email Verifier API to process marketing lead lists, detect invalid or disposable email addresses, and improve overall campaign deliverability and effectiveness.",
    category: "web-app",
    tech: ["TypeScript", "React", "AWS Integration"],
    link: "https://github.com/aperswal/Leads-List-Cleaner",
  },
  {
    title: "Social Media Poster",
    description:
      "Automation tool for scheduling and posting content across multiple social media platforms with analytics tracking.",
    category: "web-app",
    tech: ["TypeScript", "Social APIs"],
    link: "https://github.com/aperswal/social-media-poster",
  },
  {
    title: "WordFillWithFriends",
    description:
      "Multiplayer Wordle-style word guessing game with competitive tier progression (Bronze to Diamond), global leaderboards, friend challenges, and customizable profiles with real-time updates.",
    category: "web-app",
    tech: ["TypeScript", "React", "Firebase", "TailwindCSS"],
    link: "https://github.com/aperswal/WordFillWithFriends",
  },
  {
    title: "Figma Clone",
    description:
      "Fully-functional Figma clone with real-time collaboration features including multi-cursors, cursor chat, reactions, and comments. Supports shape creation, image upload, freeform drawing, element customization, and full history with undo/redo functionality.",
    category: "web-app",
    tech: ["TypeScript", "Next.js", "Fabric.js", "Liveblocks", "Tailwind CSS"],
    link: "https://github.com/aperswal/Figma_Clone",
  },
  {
    title: "Google Drive Clone",
    description:
      "File storage and sharing platform built to store blog posts from content-generator for freelance clients. Features file upload, organization, and sharing functionality similar to Google Drive.",
    category: "web-app",
    tech: ["JavaScript", "React", "Firebase", "Firestore", "Authentication"],
    link: "https://github.com/aperswal/Google-Drive-Clone",
  },
  {
    title: "Notepad Clone",
    description:
      "Desktop text editor application built as a first foray into desktop software development. Features standard text editing capabilities, file operations, and a customizable interface inspired by Microsoft Notepad.",
    category: "web-app",
    tech: ["Java", "Java Extended Library", "Java IO", "AWT", "Spring"],
    link: "https://github.com/aperswal/notepad_clone",
  },
  {
    title: "Crossy Road Clone",
    description:
      "Recreation of the popular Crossy Road game with similar mechanics, obstacles, and character movement.",
    category: "web-app",
    tech: ["JavaScript", "Canvas API"],
    link: "https://github.com/aperswal/Crossy_Road_Clone",
  },
  {
    title: "Productivity Manager",
    description:
      "Integration tool that extracts tasks from Notion databases and automatically block schedules them into Google Calendar, creating a streamlined workflow for time management and deadline tracking.",
    category: "web-app",
    tech: ["Python", "Notion API", "Google Calendar API"],
    link: "https://github.com/aperswal/Productivity-Manager",
  },
  {
    title: "Options Contract Pricing",
    description:
      "Advanced financial analytics platform for options traders with four specialized modules. Features include Black-Scholes modeling, Monte Carlo simulations, SABR volatility modeling, sentiment analysis from institutional trading data and Reddit, and mispriced contract identification through a public API.",
    category: "web-app",
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
    category: "extension",
    tech: ["JavaScript", "HTML", "CSS", "Chrome API"],
    link: "https://github.com/aperswal/Skool_Sentiment_Analysis_Chrome_Extension",
  },
  {
    title: "Skool Active Members",
    description:
      "Chrome extension that creates a leaderboard of the most active participants in Skool communities, helping admins and members identify key contributors. Core functionality uses proprietary algorithms to track engagement metrics.",
    category: "extension",
    tech: ["JavaScript", "HTML", "CSS", "Chrome API"],
    link: "https://github.com/aperswal/Skool_Active_Members_Chrome_Extension",
  },
  {
    title: "Skool Inactive Members",
    description:
      "Chrome extension that automatically scans Skool communities to identify members inactive for over 30 days. Features automated page navigation, data extraction of member profiles, and CSV export functionality for easy re-engagement outreach.",
    category: "extension",
    tech: ["JavaScript", "HTML", "Chrome API", "Manifest v3"],
    link: "https://github.com/aperswal/Skool_Inactive_Members_Chrome_Extension",
  },

  // ── AI / ML ────────────────────────────────────────────���──────────────
  {
    title: "Diabetes Heart Parkinsons Predictor",
    description:
      "Web application with multiple machine learning models to predict Diabetes, Heart Disease, and Parkinson's from patient data. Includes pre-trained models stored in the application for immediate predictions via an interactive Streamlit interface.",
    category: "ai-ml",
    tech: ["Python", "Jupyter Notebook", "Streamlit", "Machine Learning"],
    link: "https://github.com/aperswal/Diabetes_Hear_Parkinsons_Predictor",
  },
  {
    title: "Content Generator",
    description:
      "AI SEO Blog Generator that creates optimized content using OpenAI's GPT model and sources relevant images via Pexels API. Features AIDA and PAS copywriting frameworks, keyword optimization, and customizable blog structures.",
    category: "ai-ml",
    tech: ["Python", "OpenAI API", "Pexels API", "Flask"],
    link: "https://github.com/aperswal/Content-Generator",
  },
];

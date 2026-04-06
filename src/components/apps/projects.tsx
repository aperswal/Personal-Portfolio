"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  projects,
  CATEGORY_LABELS,
  type Project,
  type ProjectCategory,
} from "@/data/projects";

type Filter = ProjectCategory | "all";

const FILTERS: Filter[] = ["all", "featured", "tool", "web-app", "extension", "ai-ml"];

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-md border border-deep-brown/6 bg-cream/60 p-md">
      <div className="flex items-start justify-between gap-sm">
        <h3 className="font-display text-base font-semibold text-deep-brown">
          {project.title}
        </h3>
        {project.badge && (
          <span className="shrink-0 rounded-full bg-racing-green/10 px-1.5 py-0.5 text-[10px] font-medium text-racing-green">
            {project.badge}
          </span>
        )}
      </div>

      <p className="mt-sm line-clamp-3 text-sm leading-relaxed text-deep-brown/80">
        {project.description}
      </p>

      <div className="mt-sm flex flex-wrap gap-1">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-full bg-deep-brown/5 px-1.5 py-0.5 text-[10px] text-warm-gray"
          >
            {t}
          </span>
        ))}
      </div>

      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-sm inline-flex items-center gap-1 text-xs font-medium text-amber transition-colors hover:text-racing-green"
      >
        View Project
        <ExternalLink size={11} />
      </a>
    </div>
  );
}

export function ProjectsContent() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-deep-brown/8 bg-parchment/60 p-md">
        <div className="flex items-center gap-sm">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filter === f
                  ? "bg-deep-brown text-cream"
                  : "text-warm-gray hover:bg-deep-brown/5 hover:text-deep-brown",
              )}
            >
              {CATEGORY_LABELS[f]}
            </button>
          ))}
          <span className="ml-auto text-xs text-warm-gray">
            {filtered.length} projects
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto p-md">
        <div className="grid grid-cols-1 gap-md md:grid-cols-2">
          {filtered.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}

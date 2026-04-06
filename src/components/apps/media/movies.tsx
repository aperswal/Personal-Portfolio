"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { movies, type Movie } from "@/data/media/movies";

type Filter = "all" | "movies" | "shows";

function matchesFilter(movie: Movie, filter: Filter): boolean {
  if (filter === "all") return true;
  if (filter === "movies") return movie.type === "movie";
  return movie.type === "series";
}

export function MoviesContent() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = movies.filter((m) => matchesFilter(m, filter));

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-deep-brown/8 bg-parchment/60 p-md">
        <div className="flex items-center gap-sm">
          {(["all", "movies", "shows"] as const).map((f) => (
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
              {f === "all" ? "All" : f === "movies" ? "Movies" : "TV Shows"}
            </button>
          ))}
          <span className="ml-auto text-xs text-warm-gray">{filtered.length} titles</span>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto p-md">
        <div className="grid grid-cols-2 gap-md sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((item) => (
            <div key={item.title} className="group flex flex-col">
              <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-deep-brown/5">
                <Image
                  src={item.poster}
                  alt={`${item.title} poster`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-obsidian/80 to-transparent p-2 pt-8">
                  <div className="flex items-center gap-1 text-xs text-cream/90">
                    <Star size={12} className="fill-gold text-gold" />
                    <span>{item.rating}</span>
                    <span className="mx-0.5 text-cream/40">|</span>
                    <Clock size={11} />
                    <span>{item.duration}</span>
                  </div>
                </div>
              </div>

              <h3 className="mt-1.5 line-clamp-2 text-xs font-medium leading-tight text-deep-brown">
                {item.title}
              </h3>
              <p className="text-[10px] text-warm-gray">{item.year}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

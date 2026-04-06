"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { artworks, type Artwork } from "@/data/media/artworks";

export function GalleryContent() {
  const [selected, setSelected] = useState<Artwork | null>(null);

  const selectedIndex = selected
    ? artworks.findIndex((a) => a.title === selected.title)
    : -1;

  function navigate(direction: 1 | -1) {
    if (selectedIndex < 0) return;
    const next = (selectedIndex + direction + artworks.length) % artworks.length;
    setSelected(artworks[next]);
  }

  if (selected) {
    return (
      <div className="flex h-full flex-col bg-obsidian">
        {/* Top bar */}
        <div className="flex shrink-0 items-center justify-between px-md py-sm">
          <button
            onClick={() => setSelected(null)}
            className="text-cream/60 transition-colors hover:text-cream"
            aria-label="Back to gallery"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
          <span className="text-xs text-cream/40">
            {selectedIndex + 1} / {artworks.length}
          </span>
        </div>

        {/* Image */}
        <div className="relative flex-1">
          <Image
            src={selected.imagePath}
            alt={selected.alt}
            fill
            sizes="100vw"
            className="object-contain"
          />

          {/* Nav arrows */}
          <button
            onClick={() => navigate(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-obsidian/60 p-1.5 text-cream/60 transition-colors hover:text-cream"
            aria-label="Previous artwork"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => navigate(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-obsidian/60 p-1.5 text-cream/60 transition-colors hover:text-cream"
            aria-label="Next artwork"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Caption */}
        <div className="shrink-0 border-t border-cream/10 px-md py-sm">
          <h3 className="font-display text-sm font-medium text-cream">
            {selected.title}
          </h3>
          <p className="text-xs text-cream/50">
            {selected.artist}, {selected.year} &mdash; {selected.movement}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-md">
      <h2 className="mb-md font-display text-xl text-deep-brown">Art Gallery</h2>
      <div className="grid grid-cols-2 gap-sm sm:grid-cols-3 md:grid-cols-4">
        {artworks.map((artwork) => (
          <button
            key={artwork.title}
            onClick={() => setSelected(artwork)}
            className="group relative aspect-square overflow-hidden rounded-md bg-deep-brown/5"
          >
            <Image
              src={artwork.imagePath}
              alt={artwork.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div
              className={cn(
                "absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-obsidian/70 to-transparent p-2",
                "opacity-0 transition-opacity group-hover:opacity-100",
              )}
            >
              <h3 className="text-xs font-medium leading-tight text-cream">
                {artwork.title}
              </h3>
              <p className="text-[10px] text-cream/60">{artwork.artist}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { playlists } from "@/data/media/music";

export function MusicContent() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const playlist = playlists[selectedIndex];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <nav className="flex w-48 shrink-0 flex-col border-r border-deep-brown/8 bg-parchment/60 p-md">
        <h2 className="mb-md font-display text-lg font-semibold text-deep-brown">
          Library
        </h2>
        <ul className="space-y-xs">
          {playlists.map((pl, i) => (
            <li key={pl.name}>
              <button
                onClick={() => setSelectedIndex(i)}
                className={cn(
                  "flex w-full items-center gap-sm rounded-md px-sm py-xs text-left text-sm transition-colors",
                  selectedIndex === i
                    ? "bg-deep-brown/8 font-medium text-deep-brown"
                    : "text-warm-gray hover:bg-deep-brown/4 hover:text-deep-brown",
                )}
              >
                <span className="text-base">{"\uD83C\uDFB5"}</span>
                <span className="flex-1 truncate">{pl.name}</span>
                <span className="text-[10px] text-warm-gray">{pl.songs.length}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Song list */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="shrink-0 border-b border-deep-brown/8 bg-parchment/40 px-md pb-sm pt-md">
          <h2 className="font-display text-xl text-deep-brown">{playlist.name}</h2>
          <p className="text-xs text-warm-gray">
            {playlist.songs.length} song{playlist.songs.length !== 1 && "s"}
          </p>
        </header>

        {/* Column headers */}
        <div className="grid shrink-0 grid-cols-[2rem_1fr_3.5rem] gap-sm border-b border-deep-brown/6 px-md py-xs text-[10px] font-medium uppercase tracking-wider text-warm-gray">
          <span>#</span>
          <span>Title</span>
          <span className="text-right">Time</span>
        </div>

        {/* Songs */}
        <div className="flex-1 overflow-auto">
          {playlist.songs.map((song) => (
            <div
              key={`${song.title}-${song.artist}`}
              className="group grid grid-cols-[2rem_1fr_3.5rem] gap-sm px-md py-xs transition-colors hover:bg-deep-brown/4"
            >
              <span className="text-xs text-warm-gray">{song.rank}</span>
              <div className="min-w-0">
                <p className="truncate text-sm text-deep-brown">{song.title}</p>
                <p className="truncate text-xs text-warm-gray">{song.artist}</p>
              </div>
              <span className="text-right text-xs text-warm-gray">{song.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

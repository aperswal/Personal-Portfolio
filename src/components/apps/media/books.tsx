"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { books, type Book } from "@/data/media/books";

type Shelf = "favorites" | "reading" | "want-to-read";

const SHELF_LABELS: Record<Shelf, { label: string; icon: string }> = {
  favorites: { label: "Favorites", icon: "\u2605" },
  reading: { label: "Reading", icon: "\uD83D\uDCD6" },
  "want-to-read": { label: "Want to Read", icon: "\uD83D\uDCDA" },
};

function shelfCount(shelf: Shelf): number {
  return books.filter((b) => b.status === shelf).length;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex gap-px text-gold" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="text-xs">
          {star <= rating ? "\u2605" : "\u2606"}
        </span>
      ))}
    </span>
  );
}

export function BooksContent() {
  const [shelf, setShelf] = useState<Shelf>("favorites");

  const filtered = books.filter((b) => b.status === shelf);

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <nav className="flex w-48 shrink-0 flex-col border-r border-deep-brown/8 bg-parchment/60 p-md">
        <h2 className="mb-md font-display text-lg font-semibold text-deep-brown">
          My Books
        </h2>
        <ul className="space-y-xs">
          {(Object.keys(SHELF_LABELS) as Shelf[]).map((s) => (
            <li key={s}>
              <button
                onClick={() => setShelf(s)}
                className={cn(
                  "flex w-full items-center gap-sm rounded-md px-sm py-xs text-left text-sm transition-colors",
                  shelf === s
                    ? "bg-deep-brown/8 font-medium text-deep-brown"
                    : "text-warm-gray hover:bg-deep-brown/4 hover:text-deep-brown",
                )}
              >
                <span>{SHELF_LABELS[s].icon}</span>
                <span className="flex-1">{SHELF_LABELS[s].label}</span>
                <span className="text-[10px] text-warm-gray">{shelfCount(s)}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-md">
        <h2 className="mb-sm font-display text-xl text-deep-brown">
          {SHELF_LABELS[shelf].label}
        </h2>
        <p className="mb-md text-xs text-warm-gray">
          {filtered.length} book{filtered.length !== 1 && "s"}
        </p>

        <div className="space-y-sm">
          {filtered.map((book) => (
            <BookRow key={book.title} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BookRow({ book }: { book: Book }) {
  return (
    <div className="flex gap-md rounded-md border border-deep-brown/6 bg-cream/60 p-sm transition-colors hover:border-deep-brown/12">
      {/* Emoji cover */}
      <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded bg-deep-brown/5 text-2xl">
        {"\uD83D\uDCDA"}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-medium text-deep-brown">{book.title}</h3>
        <p className="text-xs text-warm-gray">{book.author}</p>

        {book.rating > 0 && (
          <div className="mt-1">
            <StarRating rating={book.rating} />
          </div>
        )}

        {book.progress !== undefined && (
          <div className="mt-1.5 flex items-center gap-sm">
            <div className="h-1 flex-1 rounded-full bg-deep-brown/10">
              <div
                className="h-full rounded-full bg-racing-green"
                style={{ width: `${book.progress}%` }}
              />
            </div>
            <span className="text-[10px] text-warm-gray">{book.progress}%</span>
          </div>
        )}

        <div className="mt-1.5 flex flex-wrap gap-1">
          {book.genre.map((g) => (
            <span
              key={g}
              className="rounded-full bg-deep-brown/5 px-1.5 py-0.5 text-[10px] text-warm-gray"
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

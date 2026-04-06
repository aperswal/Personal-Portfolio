import { newsletters } from "@/data/media/newsletters";

export function NewslettersContent() {
  return (
    <div className="h-full overflow-auto p-lg md:p-xl">
      <h2 className="mb-sm font-display text-xl text-deep-brown">Newsletters</h2>
      <p className="mb-lg text-xs text-warm-gray">{newsletters.length} subscriptions</p>

      <ul className="space-y-xs">
        {newsletters.map((nl) => (
          <li
            key={nl.name}
            className="flex items-center gap-md rounded-md border border-deep-brown/6 bg-cream/60 px-md py-sm transition-colors hover:border-deep-brown/12"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-deep-brown/5 text-sm">
              {"\u2709\uFE0F"}
            </span>
            <span className="text-sm font-medium text-deep-brown">{nl.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

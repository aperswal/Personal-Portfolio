import { podcasts } from "@/data/media/podcasts";

export function PodcastsContent() {
  return (
    <div className="h-full overflow-auto p-lg md:p-xl">
      <h2 className="mb-sm font-display text-xl text-deep-brown">Podcasts</h2>
      <p className="mb-lg text-xs text-warm-gray">{podcasts.length} shows</p>

      <ul className="space-y-xs">
        {podcasts.map((pod, i) => (
          <li
            key={pod.name}
            className="flex items-center gap-md rounded-md border border-deep-brown/6 bg-cream/60 px-md py-sm transition-colors hover:border-deep-brown/12"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-deep-brown/5 text-xs font-medium text-warm-gray">
              {i + 1}
            </span>
            <span className="text-sm font-medium text-deep-brown">{pod.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

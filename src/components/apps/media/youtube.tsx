import { youtubeChannels } from "@/data/media/youtube";

export function YouTubeContent() {
  const totalChannels = youtubeChannels.reduce(
    (sum, cat) => sum + cat.channels.length,
    0,
  );

  return (
    <div className="h-full overflow-auto p-lg md:p-xl">
      <h2 className="mb-sm font-display text-xl text-deep-brown">YouTube Channels</h2>
      <p className="mb-lg text-xs text-warm-gray">{totalChannels} channels</p>

      <div className="space-y-lg">
        {youtubeChannels.map((cat) => (
          <section key={cat.category}>
            <h3 className="mb-sm text-xs font-medium uppercase tracking-wider text-warm-gray">
              {cat.category}
            </h3>
            <div className="flex flex-wrap gap-xs">
              {cat.channels.map((channel) => (
                <span
                  key={channel}
                  className="rounded-full border border-deep-brown/8 bg-cream/80 px-2.5 py-1 text-xs font-medium text-deep-brown transition-colors hover:border-deep-brown/15 hover:bg-deep-brown/5"
                >
                  {channel}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

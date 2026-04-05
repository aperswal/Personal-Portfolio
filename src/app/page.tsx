import { Mail, ArrowRight } from "lucide-react";

function GithubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function Divider() {
  return (
    <div
      className="h-px w-full my-xl"
      style={{
        background:
          "linear-gradient(to right, transparent, rgba(62, 42, 26, 0.12), transparent)",
      }}
    />
  );
}

function PlaceholderCard({ index }: { index: number }) {
  return (
    <div className="flex-1 rounded-md border border-deep-brown/12 bg-white p-lg">
      <div className="mb-md h-36 rounded-sm bg-cream" />
      <p className="font-display text-lg italic text-deep-brown">
        Coming Soon
      </p>
      <p className="mt-sm text-sm text-warm-gray">Slot {index}</p>
    </div>
  );
}

function CarouselSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section>
      <p className="font-display text-sm uppercase tracking-[3px] text-amber">
        {title}
      </p>
      <h2 className="mt-sm font-display text-3xl font-light text-obsidian md:text-4xl">
        {description}
      </h2>
      <div className="mt-lg flex gap-lg">
        <PlaceholderCard index={1} />
        <PlaceholderCard index={2} />
        <PlaceholderCard index={3} />
      </div>
      <a
        href="#"
        className="mt-lg inline-flex items-center gap-sm text-sm font-medium text-warm-gray transition-colors hover:text-amber"
      >
        See more <ArrowRight size={14} strokeWidth={1.5} />
      </a>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-deep-brown/12 bg-parchment/80 px-lg backdrop-blur-md md:px-xl">
        <span className="font-display text-xl text-obsidian">Adi</span>
        <div className="flex items-center gap-lg">
          <a
            href="mailto:Adityaperswal@gmail.com"
            className="text-xs font-medium uppercase tracking-[2px] text-warm-gray transition-colors hover:text-amber"
          >
            Contact
          </a>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-5xl flex-1 px-lg py-2xl md:px-2xl lg:px-3xl">
        {/* Letter */}
        <article className="font-body text-lg leading-[1.7] text-deep-brown">
          <p>Hi my name is Adi.</p>

          <p className="mt-lg">I work at Amazon as a software engineer.</p>

          <p className="mt-lg">
            I studied computer engineering at University of Illinois Urbana
            Champaign.
          </p>

          <p className="mt-lg">
            During my time at UIUC I also interned at CME Group and
            McDonald&apos;s.
          </p>

          <p className="mt-lg">
            Before I was sure I wanted to be a software engineer, I consulted at
            Illinois Business Consulting.
          </p>

          <p className="mt-lg">
            Throughout college I ran a sales funnel agency where I helped people
            get more customers. Be it by making them logos, social media content,
            websites, or running their Google/Meta ads.
          </p>

          <p className="mt-lg">
            From Dec 2019 - Feb 2025 I have worked with over 50 companies
            through my agency.
          </p>

          <p className="mt-lg">
            I love playing video games, learning about art history, cooking, and
            weight lifting. I am trying to learn to love running, so far I have
            gone from hating it to it not being annoying. I enjoy trading stocks,
            playing poker, and learning new mental models. I don&apos;t like
            small talk.
          </p>
        </article>

        <Divider />

        {/* Projects */}
        <CarouselSection
          title="Projects"
          description="Here are a few projects I have worked on."
        />

        <Divider />

        {/* Videos */}
        <CarouselSection
          title="Videos"
          description="Here are a few videos to get to know me."
        />

        <Divider />

        {/* Essays */}
        <CarouselSection
          title="Essays"
          description="Here are a few essays to learn from me."
        />

        <Divider />
      </main>

      {/* Footer */}
      <footer className="border-t border-deep-brown/12 bg-cream">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-lg px-lg py-xl md:flex-row md:justify-between md:px-2xl lg:px-3xl">
          <span className="font-display text-lg text-obsidian">
            Adi Perswal
          </span>
          <div className="flex items-center gap-lg">
            <a
              href="mailto:Adityaperswal@gmail.com"
              aria-label="Email"
              className="text-warm-gray transition-colors hover:text-amber"
            >
              <Mail size={20} strokeWidth={1.5} />
            </a>
            <a
              href="https://linkedin.com/in/aditya-perswal"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-warm-gray transition-colors hover:text-amber"
            >
              <LinkedinIcon size={20} />
            </a>
            <a
              href="https://github.com/aperswal"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-warm-gray transition-colors hover:text-amber"
            >
              <GithubIcon size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

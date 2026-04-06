import { Desktop } from "@/components/desktop/desktop";
import { JsonLd } from "@/components/shared/json-ld";
import { siteConfig, socialLinks } from "@/data/personal";
import { APP_IDS, buildApp } from "@/data/apps";
import { CoverLetterContent } from "@/components/apps/cover-letter";
import { ContactContent } from "@/components/apps/contact";
import { ExperienceContent } from "@/components/apps/experience";
import { ProjectsContent } from "@/components/apps/projects";
import { MediaFolderContent } from "@/components/apps/media-folder";
import { MoviesContent } from "@/components/apps/media/movies";
import { BooksContent } from "@/components/apps/media/books";
import { MusicContent } from "@/components/apps/media/music";
import { GalleryContent } from "@/components/apps/media/gallery";
import { YouTubeContent } from "@/components/apps/media/youtube";
import { NewslettersContent } from "@/components/apps/media/newsletters";
import { PodcastsContent } from "@/components/apps/media/podcasts";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: `${siteConfig.title} at ${siteConfig.company}`,
    url: siteConfig.url,
    email: siteConfig.email,
    image: `${siteConfig.url}/headshot.jpg`,
    description: siteConfig.description,
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "University of Illinois Urbana-Champaign",
    },
    worksFor: {
      "@type": "Organization",
      name: "Amazon",
    },
    sameAs: [socialLinks.github, socialLinks.linkedin],
    knowsAbout: [
      "TypeScript",
      "React",
      "Next.js",
      "AWS",
      "Python",
      "Go",
      "System Design",
    ],
  },
};

const apps = [
  buildApp(APP_IDS.COVER_LETTER, <CoverLetterContent />),
  buildApp(APP_IDS.PROJECTS, <ProjectsContent />),
  buildApp(APP_IDS.EXPERIENCE, <ExperienceContent />),
  buildApp(APP_IDS.MEDIA, <MediaFolderContent />),
  buildApp(APP_IDS.MOVIES, <MoviesContent />),
  buildApp(APP_IDS.BOOKS, <BooksContent />),
  buildApp(APP_IDS.MUSIC, <MusicContent />),
  buildApp(APP_IDS.GALLERY, <GalleryContent />),
  buildApp(APP_IDS.YOUTUBE, <YouTubeContent />),
  buildApp(APP_IDS.NEWSLETTERS, <NewslettersContent />),
  buildApp(APP_IDS.PODCASTS, <PodcastsContent />),
  buildApp(APP_IDS.CONTACT, <ContactContent />),
];

export default function Home() {
  return (
    <>
      <JsonLd data={personSchema} />
      <Desktop apps={apps} initialAppId={APP_IDS.COVER_LETTER} />
    </>
  );
}

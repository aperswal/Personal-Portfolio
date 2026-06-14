import { siteConfig, socialLinks } from "@/data/personal";
import { workExperience } from "@/data/experience";
import { projects } from "@/data/projects";

/**
 * A visually-hidden but fully crawlable semantic mirror of the site's content.
 * The interactive macOS-desktop UI renders content into a client-side canvas
 * that search and answer-engine crawlers cannot parse, so this server component
 * emits the same information as real DOM (headings, landmarks, links, lists).
 *
 * Uses Tailwind `sr-only` (the clip technique) rather than display:none/hidden
 * on purpose: crawlers down-weight display:none and screen readers skip it,
 * whereas sr-only content stays in the accessibility tree and the indexable DOM.
 */
export function SeoContent() {
  return (
    <main id="main-content" className="sr-only">
      <h1>
        {siteConfig.name} — {siteConfig.title} at {siteConfig.company}
      </h1>
      <p>{siteConfig.description}</p>

      <section>
        <h2>Experience</h2>
        {workExperience.map((experience) =>
          experience.roles.map((role) => (
            <article key={`${experience.company}-${role.title}-${role.period}`}>
              <h3>
                {experience.company} — {role.title} ({role.period})
              </h3>
              {role.location ? <p>{role.location}</p> : null}
              {role.bullets.length > 0 ? (
                <ul>
                  {role.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          )),
        )}
      </section>

      <section>
        <h2>Projects</h2>
        {projects.map((project) => (
          <article key={project.title}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            {project.link ? <a href={project.link}>{project.title}</a> : null}
          </article>
        ))}
      </section>

      <section>
        <h2>Contact</h2>
        <ul>
          <li>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </li>
          <li>
            <a href={socialLinks.github}>GitHub</a>
          </li>
          <li>
            <a href={socialLinks.linkedin}>LinkedIn</a>
          </li>
        </ul>
      </section>
    </main>
  );
}

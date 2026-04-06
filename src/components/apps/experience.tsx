import { workExperience, type Experience, type Role } from "@/data/experience";

function RoleSection({ role, isFirst }: { role: Role; isFirst: boolean }) {
  return (
    <div className={isFirst ? "" : "mt-md border-t border-deep-brown/6 pt-md"}>
      <div className="flex items-start justify-between gap-md">
        <p className="text-sm font-medium text-amber">{role.title}</p>
        <p className="shrink-0 text-xs text-warm-gray">{role.period}</p>
      </div>

      {role.location && <p className="text-xs text-warm-gray">{role.location}</p>}

      {role.bullets.length > 0 && (
        <ul className="mt-sm space-y-1">
          {role.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex gap-sm text-sm leading-relaxed text-deep-brown/80"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-deep-brown/30" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}

      {role.technologies && role.technologies.length > 0 && (
        <div className="mt-sm flex flex-wrap gap-1">
          {role.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-deep-brown/5 px-1.5 py-0.5 text-[10px] text-warm-gray"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ExperienceCard({ exp }: { exp: Experience }) {
  return (
    <div className="rounded-md border border-deep-brown/6 bg-cream/60 p-md">
      <div className="flex items-start justify-between gap-md">
        <h3 className="font-display text-base font-semibold text-deep-brown">
          {exp.company}
        </h3>
        <div className="flex shrink-0 items-center gap-1.5">
          {exp.type && (
            <span className="rounded-full bg-deep-brown/5 px-1.5 py-0.5 text-[10px] text-warm-gray">
              {exp.type}
            </span>
          )}
        </div>
      </div>

      {exp.location && <p className="text-xs text-warm-gray">{exp.location}</p>}

      {exp.roles.map((role, i) => (
        <RoleSection key={role.title} role={role} isFirst={i === 0} />
      ))}
    </div>
  );
}

export function ExperienceContent() {
  return (
    <div className="h-full overflow-auto p-lg md:p-xl">
      <h2 className="mb-md font-display text-xl text-deep-brown">Experience</h2>

      <div className="space-y-md">
        {workExperience.map((exp) => (
          <ExperienceCard key={exp.company} exp={exp} />
        ))}
      </div>
    </div>
  );
}

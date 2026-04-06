import { siteConfig, socialLinks } from "@/data/personal";
import { Mail, Phone, ExternalLink } from "lucide-react";

export function ContactContent() {
  return (
    <div className="space-y-lg p-lg md:p-xl">
      <h3 className="font-display text-2xl text-obsidian">{siteConfig.name}</h3>
      <p className="text-sm text-warm-gray">{siteConfig.location}</p>

      <div className="mt-lg space-y-md">
        <a
          href={`tel:${siteConfig.phone}`}
          className="flex items-center gap-md text-deep-brown transition-colors hover:text-amber"
        >
          <Phone size={18} strokeWidth={1.5} />
          <span>{siteConfig.phone}</span>
        </a>
        <a
          href={socialLinks.email}
          className="flex items-center gap-md text-deep-brown transition-colors hover:text-amber"
        >
          <Mail size={18} strokeWidth={1.5} />
          <span>{siteConfig.email}</span>
        </a>
        <a
          href={socialLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-md text-deep-brown transition-colors hover:text-amber"
        >
          <ExternalLink size={18} strokeWidth={1.5} />
          <span>linkedin.com/in/aditya-perswal</span>
        </a>
        <a
          href={socialLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-md text-deep-brown transition-colors hover:text-amber"
        >
          <ExternalLink size={18} strokeWidth={1.5} />
          <span>github.com/aperswal</span>
        </a>
      </div>
    </div>
  );
}

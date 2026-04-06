export const siteConfig = {
  name: "Adi Perswal",
  shortName: "Adi",
  title: "Software Engineer",
  company: "Amazon",
  description:
    "Software engineer at Amazon. UIUC Computer Engineering. Builder of things that last.",
  url: "https://adiperswal.com",
  email: "adityaperswal@gmail.com",
  phone: "(847) 767-3725",
  location: "Seattle, WA",
} as const;

export const socialLinks = {
  github: "https://github.com/aperswal",
  linkedin: "https://linkedin.com/in/aditya-perswal",
  email: `mailto:${siteConfig.email}`,
} as const;

export const navLinks = [
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Media", href: "/media" },
  { label: "Videos", href: "/videos" },
  { label: "Essays", href: "/essays" },
  { label: "About", href: "/about" },
] as const;

export interface SiteConfig {
  name: string;
  handle: string;
  title: string;
  description: string;
  url: string;
  email: string;
  locale: "en";
  isAvailable: boolean;
  ogDefault: string;
  nav: Array<{ label: string; href: string }>;
}

export const site: SiteConfig = {
  name: "Your Name",
  handle: "yourhandle",
  title: "Your Name — Senior Frontend Engineer",
  description: "Senior frontend engineer building fast, accessible interfaces.",
  url: "https://example.com",
  email: "you@example.com",
  locale: "en",
  isAvailable: true,
  ogDefault: "/opengraph-image",
  nav: [
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
};

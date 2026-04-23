export interface SiteConfig {
  name: string;
  handle: string;
  role: string;
  location: string;
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
  name: "İlker Balcılar",
  handle: "ilker",
  role: "Frontend Engineer",
  location: "Istanbul",
  title: "İlker Balcılar — Senior Frontend Engineer",
  description: "Senior frontend engineer building fast, accessible interfaces.",
  url: "https://example.com",
  email: "ilkerbalcilartr@gmail.com",
  locale: "en",
  isAvailable: true,
  ogDefault: "/opengraph-image",
  nav: [
    { label: "projects", href: "/projects" },
    { label: "about", href: "/about" },
    { label: "blog", href: "/blog" },
    { label: "contact", href: "/contact" },
  ],
};

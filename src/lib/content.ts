import {
  about,
  education,
  experiences,
  posts,
  projects,
  site,
  skills,
  socials,
  stacks,
  type About,
  type Education,
  type Experience,
  type Post,
  type Project,
  type Site,
  type Skill,
  type Social,
  type Stack,
} from "#site/content";

export { about, education, experiences, posts, projects, site, skills, socials, stacks };
export type { About, Education, Experience, Post, Project, Site, Skill, Social, Stack };

export type ProjectCategory = Project["category"];

// ───── Posts ──────────────────────────────────────────────────────────────────
export function getPublishedPosts(): Post[] {
  return posts
    .filter((post) => !post.draft)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getFeaturedPosts(): Post[] {
  return getPublishedPosts().filter((post) => post.featured);
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getPostsByCategory(category: string): Post[] {
  return getPublishedPosts().filter((post) => post.category === category);
}

export function getAllBlogCategories(): string[] {
  return Array.from(new Set(posts.map((post) => post.category))).sort();
}

export function getAllBlogTags(): string[] {
  return Array.from(new Set(posts.flatMap((post) => post.tags))).sort();
}

// ───── Projects ───────────────────────────────────────────────────────────────
export function getAllProjects(): Project[] {
  return projects
    .slice()
    .sort((a, b) => (a.featured === b.featured ? b.year - a.year : a.featured ? -1 : 1));
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((project) => project.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export interface ProjectFilter {
  category?: ProjectCategory;
  stack?: string[];
}

export function filterProjects(filter: ProjectFilter): Project[] {
  return getAllProjects().filter((project) => {
    if (filter.category && project.category !== filter.category) return false;
    if (filter.stack && filter.stack.length > 0) {
      for (const stack of filter.stack) {
        if (!project.stack.includes(stack)) return false;
      }
    }
    return true;
  });
}

export function getAllProjectCategories(): ProjectCategory[] {
  return Array.from(new Set(projects.map((project) => project.category))).sort();
}

export function getAllProjectStacks(): string[] {
  return Array.from(new Set(projects.flatMap((project) => project.stack))).sort();
}

// ───── Experience / Education ─────────────────────────────────────────────────
export function getExperiencesSorted(): Experience[] {
  return experiences.slice().sort((a, b) => b.start.localeCompare(a.start));
}

export function getEducationSorted(): Education[] {
  return education.slice().sort((a, b) => b.start.localeCompare(a.start));
}

// ───── Data ───────────────────────────────────────────────────────────────────
export function getSkillsByCategory(): Record<Skill["category"], Skill[]> {
  const buckets = {} as Record<Skill["category"], Skill[]>;
  for (const skill of skills) {
    (buckets[skill.category] ??= []).push(skill);
  }
  return buckets;
}

export function getStacksByCategory(): Record<Stack["category"], Stack[]> {
  const buckets = {} as Record<Stack["category"], Stack[]>;
  for (const stack of stacks) {
    (buckets[stack.category] ??= []).push(stack);
  }
  return buckets;
}

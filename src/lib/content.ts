import {
  education,
  experiences,
  posts,
  projects,
  site,
  skills,
  socials,
  stacks,
  type Education,
  type Experience,
  type Post,
  type Project,
  type Site,
  type Skill,
  type Social,
  type Stack,
} from "#site/content";

export { education, experiences, posts, projects, site, skills, socials, stacks };
export type { Education, Experience, Post, Project, Site, Skill, Social, Stack };

// ───── Posts ──────────────────────────────────────────────────────────────────
export function getPublishedPosts(): Post[] {
  return posts
    .filter((post) => !post.draft)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

// ───── Projects ───────────────────────────────────────────────────────────────
export function getAllProjects(): Project[] {
  return projects.slice();
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
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

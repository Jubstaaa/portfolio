import type { Metadata } from 'next'

import { PathBar } from '@/components/path-bar'
import { SectionHeading } from '@/components/section-heading'
import { site } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

import { Education } from './education'
import { Experience } from './experience'
import { Skills, Stacks } from './skills'

export const metadata: Metadata = buildMetadata({
    description:
        'Software engineer based in Istanbul. Full-stack web development with Next.js, React, TypeScript, Node.js, and cloud infra. Currently studying Software Engineering.',
    keywords: [
        'ilker balcilar',
        'software engineer',
        'frontend engineer',
        'full-stack developer',
        'istanbul',
        'nextjs developer',
        'typescript',
        'react',
    ],
    path: '/about',
    title: 'About',
})

export default function AboutPage() {
    return (
        <>
            <PathBar
                meta={`${site.role} · ${site.location}`}
                path={`~/${site.handle}/about`}
            />
            <section className="container-default section-pad space-y-20">
                <div className="max-w-3xl space-y-10">
                    <SectionHeading as="h1" number="01" title="bio" />
                    <div className="text-foreground space-y-4 leading-relaxed">
                        <p>
                            I&apos;m a software engineering student based in
                            Istanbul. I build full-stack web applications —
                            mostly with Next.js, React, and Node.js, and I work
                            with TypeScript end-to-end.
                        </p>
                        <p>
                            I&apos;ve shipped projects from UI to infra: writing
                            the frontend, designing the API, modeling the data,
                            and setting up servers with Nginx on Ubuntu.
                            I&apos;ve used GitHub Actions to automate
                            deployments and enjoy working with teams to create
                            clean, fast, and accessible web experiences.
                        </p>
                        <p>
                            My biggest motivation is combining my technical
                            skills with my passion for gaming and entertainment
                            to build projects that are both useful and fun.
                        </p>
                    </div>
                </div>

                <Experience />
                <Education />
                <Skills />
                <Stacks />
            </section>
        </>
    )
}

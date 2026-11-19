import type { Metadata } from 'next'

import { Education } from '@/app/about/_components/education'
import { Experience } from '@/app/about/_components/experience'
import { Skills } from '@/app/about/_components/skills'
import { Stacks } from '@/app/about/_components/stacks'
import { PathBar } from '@/components/path-bar'
import { SectionHeading } from '@/components/section-heading'
import { site } from '@/features/content/content'
import { buildMetadata } from '@/lib/seo'

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
            <PathBar meta={`${site.role} · ${site.location}`} segment="about" />
            <section className="container-default section-pad space-y-20">
                <div className="space-y-10">
                    <SectionHeading as="h1" number="01" title="bio" />
                    <div className="text-foreground space-y-4 leading-relaxed">
                        <p>
                            I&apos;m a software engineer based in Istanbul with
                            five years of experience shipping production web and
                            mobile apps in TypeScript. At Macellan I build
                            fintech products: the Box Office web panel, the
                            JoyPort customer wallet app and the company&apos;s
                            React component library.
                        </p>
                        <p>
                            I like the infra side too: my own projects run as
                            Dockerized apps on a DigitalOcean droplet behind
                            Caddy, shipped through GitHub Actions.
                        </p>
                        <p>
                            In my spare time I build open-source developer tools
                            and publish them on npm, with a soft spot for
                            anything gaming-related.
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

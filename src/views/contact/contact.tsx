import type { Metadata } from 'next'

import { CopyEmail } from '@/components/copy-email/copy-email'
import { PathBar } from '@/components/path-bar/path-bar'
import { SectionHeading } from '@/components/section-heading/section-heading'
import { SocialLinks } from '@/components/social-links/social-links'
import { site } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
    description:
        'Get in touch with İlker Balcılar — email and social links for collaboration, contract work, or open-source questions.',
    keywords: [
        'contact ilker balcilar',
        'hire frontend engineer',
        'freelance developer istanbul',
    ],
    path: '/contact',
    title: 'Contact',
})

export default function ContactPage() {
    return (
        <>
            <PathBar meta="email · sociallinks" segment="contact" />
            <section className="container-default section-pad space-y-12">
                <SectionHeading
                    as="h1"
                    description="The fastest way to reach me is email. For everything else, socials below."
                    number="01"
                    title="contact"
                />

                <div className="space-y-4">
                    <p className="text-muted-foreground label-caps">email</p>
                    <CopyEmail email={site.email} />
                </div>

                <div className="space-y-4">
                    <p className="text-muted-foreground label-caps">socials</p>
                    <SocialLinks />
                </div>
            </section>
        </>
    )
}

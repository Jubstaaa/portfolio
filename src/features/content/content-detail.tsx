import type { ReactNode } from 'react'
import type { BreadcrumbList, Thing, WithContext } from 'schema-dts'

import { JsonLd } from '@/components/json-ld'
import { PathBar } from '@/components/path-bar'
import { SectionHeading } from '@/components/section-heading'
import { DeferredImg } from '@/features/content/mdx-components/deferred-image'

import { AdjacentNav } from './adjacent-nav'
import { ArticleHeader } from './article-header'
import { ContentImage } from './content-image'
import { Mdx } from './mdx'
import { Prose } from './prose'

interface ContentDetailProps {
    adjacent: {
        ariaLabel: string
        next?: { path: string; title: string }
        prev?: { path: string; title: string }
    }
    body?: string | undefined
    cover?:
        undefined | { alt: string; height: number; src: string; width: number }
    header: {
        children?: ReactNode
        lead: string
        meta: ReactNode
        tags?: ReactNode
        title: string
    }
    highlights?: string[] | undefined
    jsonLd: {
        breadcrumb: WithContext<BreadcrumbList>
        entity: WithContext<Thing>
        idPrefix: string
        slug: string
    }
    pathBar: { meta: string; segment: string }
}

const DEFERRED_BODY_IMAGES = { img: DeferredImg }

export function ContentDetail({
    adjacent,
    body,
    cover,
    header,
    highlights,
    jsonLd,
    pathBar,
}: ContentDetailProps) {
    return (
        <>
            <JsonLd
                data={jsonLd.entity}
                id={`ld-${jsonLd.idPrefix}-${jsonLd.slug}`}
            />
            <JsonLd
                data={jsonLd.breadcrumb}
                id={`ld-breadcrumb-${jsonLd.slug}`}
            />
            <PathBar meta={pathBar.meta} segment={pathBar.segment} />
            <section className="container-default section-pad">
                <article className="mx-auto max-w-3xl min-w-0 space-y-8">
                    <ArticleHeader
                        lead={header.lead}
                        meta={header.meta}
                        title={header.title}
                        {...(header.tags ? { tags: header.tags } : {})}>
                        {header.children}
                    </ArticleHeader>

                    {cover ? (
                        <ContentImage
                            alt={cover.alt}
                            height={cover.height}
                            lcpCandidate
                            src={cover.src}
                            width={cover.width}
                        />
                    ) : null}

                    {body ? (
                        <Prose>
                            <Mdx
                                code={body}
                                {...(cover
                                    ? { components: DEFERRED_BODY_IMAGES }
                                    : {})}
                            />
                        </Prose>
                    ) : null}

                    {highlights && highlights.length > 0 ? (
                        <div className="space-y-4">
                            <SectionHeading title="highlights" />
                            <ul className="text-foreground space-y-2">
                                {highlights.map(h => (
                                    <li className="arrow-bullet" key={h}>
                                        {h}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    <AdjacentNav
                        {...(adjacent.prev ? { prev: adjacent.prev } : {})}
                        {...(adjacent.next ? { next: adjacent.next } : {})}
                        ariaLabel={adjacent.ariaLabel}
                    />
                </article>
            </section>
        </>
    )
}

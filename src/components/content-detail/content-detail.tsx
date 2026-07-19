import { AdjacentNav } from '@/components/adjacent-nav/adjacent-nav'
import { ArticleHeader } from '@/components/article-header/article-header'
import { ContentImage } from '@/components/content-image/content-image'
import { JsonLd } from '@/components/json-ld/json-ld'
import { Mdx } from '@/components/mdx/mdx'
import { PathBar } from '@/components/path-bar/path-bar'
import { Prose } from '@/components/prose/prose'
import { SectionHeading } from '@/components/section-heading/section-heading'

import type { ContentDetailProps } from './content-detail.types'

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
                            priority
                            alt={cover.alt}
                            height={cover.height}
                            src={cover.src}
                            width={cover.width}
                        />
                    ) : null}

                    {body ? (
                        <Prose>
                            <Mdx code={body} />
                        </Prose>
                    ) : null}

                    {highlights && highlights.length > 0 ? (
                        <div className="space-y-4">
                            <SectionHeading title="highlights" />
                            <ul className="text-foreground space-y-2">
                                {highlights.map(h => (
                                    <li key={h} className="arrow-bullet">
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

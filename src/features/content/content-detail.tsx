import { JsonLd } from '@/components/json-ld'
import { PathBar } from '@/components/path-bar'
import { SectionHeading } from '@/components/section-heading'

import type { ContentDetailProps } from './content-detail.types'

import { AdjacentNav } from './adjacent-nav'
import { ArticleHeader } from './article-header'
import { DEFERRED_BODY_IMAGES } from './content-detail.constants'
import { ContentImage } from './content-image'
import { Mdx } from './mdx'
import { Prose } from './prose'

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
                            preload
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

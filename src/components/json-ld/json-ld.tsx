import type { JsonLdProps } from './json-ld.types'

export function JsonLd({ data, id }: JsonLdProps) {
    return (
        <script
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data).replace(/</g, '\\u003c'),
            }}
            id={id}
            type="application/ld+json"
        />
    )
}

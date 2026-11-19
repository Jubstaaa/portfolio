import type { Thing, WithContext } from 'schema-dts'

interface JsonLdProps {
    data: WithContext<Thing>
    id: string
}
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

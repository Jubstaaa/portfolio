import type { Thing, WithContext } from 'schema-dts'

export interface JsonLdProps {
    data: WithContext<Thing>
    id: string
}

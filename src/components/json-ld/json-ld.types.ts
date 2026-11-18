import type { Thing, WithContext } from 'schema-dts'

export interface JsonLdProps {
    id: string
    data: WithContext<Thing>
}

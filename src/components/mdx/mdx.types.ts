export type MdxComponent = React.ComponentType<{
    components?: Record<string, React.ElementType>
}>

export interface MdxProps {
    code: string
    components?: Record<string, React.ElementType>
}

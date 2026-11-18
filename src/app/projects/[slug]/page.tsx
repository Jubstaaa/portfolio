export {
    default,
    generateMetadata,
    generateStaticParams,
} from '@/views/projects/project-detail'

// Segment config must be a literal in the route file: Next parses it statically
// and rejects re-exports. Unknown slugs 404 instead of rendering on demand.
export const dynamicParams = false

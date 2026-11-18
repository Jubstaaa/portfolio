export {
    default,
    generateStaticParams,
} from '@/views/projects/project-og-image'

// Route segment and image config must be literals in the route file: Next parses
// them statically and rejects re-exports.
export const dynamicParams = false
export const size = { height: 630, width: 1200 }
export const contentType = 'image/jpeg'

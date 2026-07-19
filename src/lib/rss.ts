import { Feed } from 'feed'

import { getPublishedPosts, site } from '@/lib/content'

export function buildRss(): string {
    const posts = getPublishedPosts().slice(0, 20)
    const author = { link: site.url, name: site.name }

    const feed = new Feed({
        author,
        copyright: `© ${new Date().getFullYear()} ${site.name}`,
        description: site.description,
        feedLinks: { rss: new URL('/feed.xml', site.url).toString() },
        id: site.url,
        language: site.locale,
        link: site.url,
        title: site.name,
        ...(posts[0] ? { updated: new Date(posts[0].date) } : {}),
    })

    for (const post of posts) {
        const url = new URL(post.path, site.url).toString()
        feed.addItem({
            author: [author],
            category: [post.category, ...post.tags].map(name => ({ name })),
            date: new Date(post.date),
            description: post.description,
            id: url,
            link: url,
            title: post.title,
        })
    }

    return feed.rss2()
}

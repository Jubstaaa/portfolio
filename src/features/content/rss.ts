import { Feed } from 'feed'

import { absoluteUrl } from '@/lib/site'

import { getPublishedPosts, site } from './content'

export function buildRss(): string {
    const posts = getPublishedPosts().slice(0, 20)
    const author = { link: site.url, name: site.name }

    const feed = new Feed({
        author,
        copyright: `© ${new Date().getFullYear()} ${site.name}`,
        description: site.description,
        feedLinks: { rss: absoluteUrl('/feed.xml') },
        id: site.url,
        language: site.locale,
        link: site.url,
        title: site.name,
        ...(posts[0] ? { updated: new Date(posts[0].date) } : {}),
    })

    for (const post of posts) {
        const url = absoluteUrl(post.path)
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

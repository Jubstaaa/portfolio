import { Anchor } from './anchor'
import { Blockquote } from './blockquote'
import { Em } from './emphasis'
import { makeHeading } from './heading'
import { Hr } from './horizontal-rule'
import { Img } from './image'
import { InlineCode } from './inline-code'
import { Li } from './list-item'
import { Note } from './note'
import { Ol } from './ordered-list'
import { P } from './paragraph'
import { Pre } from './pre'
import { Strong } from './strong'
import { Table, Tbody, Td, Th, Thead, Tr } from './table'
import { Ul } from './unordered-list'
import { Warn } from './warn'

const H1 = makeHeading('h1')
const H2 = makeHeading('h2')
const H3 = makeHeading('h3')
const H4 = makeHeading('h4')

export const mdxComponents = {
    a: Anchor,
    blockquote: Blockquote,
    code: InlineCode,
    em: Em,
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    hr: Hr,
    img: Img,
    li: Li,
    Note,
    ol: Ol,
    p: P,
    pre: Pre,
    strong: Strong,
    table: Table,
    tbody: Tbody,
    td: Td,
    th: Th,
    thead: Thead,
    tr: Tr,
    ul: Ul,
    Warn,
} as const

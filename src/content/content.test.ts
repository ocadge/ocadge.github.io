import { describe, expect, it } from 'vitest'
import { safeLink } from '../lib/safeLink.ts'
import { about, skillGroups, timeline } from './cv.ts'
import { nowItems } from './now.ts'
import { projects } from './projects.ts'

// Checks on the content files beyond the project rules in projects.test.ts.
describe('content', () => {
  it('fills in every field of the about, skills and timeline content', () => {
    const texts = [
      about.headline,
      ...about.paragraphs,
      ...about.facts.flatMap((f) => [f.label, f.value]),
      ...skillGroups.flatMap((g) => [g.name, ...g.skills]),
      ...timeline.flatMap((t) => [t.dates, t.title, t.place, t.summary]),
      ...nowItems.flatMap((n) => [n.tab, n.title, n.summary]),
    ]
    for (const text of texts) expect(text.trim()).not.toBe('')
    for (const g of skillGroups) expect(g.skills.length, g.name).toBeGreaterThan(0)
  })

  it('only has links the safe-link helper allows', () => {
    const urls = [
      ...projects.flatMap((p) => Object.values(p.links)),
      ...nowItems.flatMap((n) => (n.link ? [n.link.href] : [])),
    ]
    for (const url of urls) expect(safeLink(url), url).not.toBeNull()
  })
})

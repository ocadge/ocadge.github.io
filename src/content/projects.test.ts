import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { groups, projects } from './projects.ts'

// These are the publishing rules. If one fails, CI blocks the merge.
describe('projects', () => {
  it('never links to code that is not public', () => {
    for (const p of projects) if (!p.codePublic) expect(p.links.code, p.id).toBeUndefined()
  })

  it('only links to https pages or pages on this site', () => {
    for (const p of projects)
      for (const url of Object.values(p.links)) expect(url, p.id).toMatch(/^(https:\/\/|\/[^/])/)
  })

  it('gives every card a way to see the work', () => {
    for (const p of projects) {
      if (p.view === 'live') expect(p.links.live, p.id).toBeTruthy()
      if (p.view === 'screenshots') expect(p.images?.length, p.id).toBeGreaterThan(0)
    }
  })

  it('has alt text and a real file for every image', () => {
    for (const img of projects.flatMap((p) => p.images ?? [])) {
      expect(img.alt.length, img.src).toBeGreaterThan(10)
      expect(existsSync(`public${img.src}`), img.src).toBe(true)
    }
  })

  it('fills in every text field and has unique ids', () => {
    for (const p of projects)
      for (const field of [p.title, p.summary, p.built, p.learned]) expect(field.trim(), p.id).not.toBe('')
    expect(new Set(projects.map((p) => p.id)).size).toBe(projects.length)
  })

  it('has at least one project in every group', () => {
    for (const g of groups)
      expect(
        projects.some((p) => p.group === g.id),
        g.id,
      ).toBe(true)
  })
})

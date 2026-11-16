import { describe, expect, it } from 'vitest'
import { safeLink } from './safeLink.ts'

describe('safeLink', () => {
  it('allows https links and marks them as external', () => {
    expect(safeLink('https://github.com/ocadge')).toEqual({
      href: 'https://github.com/ocadge',
      rel: 'noopener noreferrer',
    })
  })

  it('allows mailto links and pages on this site', () => {
    expect(safeLink('mailto:someone@example.com')).toEqual({ href: 'mailto:someone@example.com' })
    expect(safeLink('/explorer/')).toEqual({ href: '/explorer/' })
  })

  it('rejects everything else', () => {
    for (const url of [
      'http://example.com',
      'javascript:alert(1)',
      ' javascript:alert(1)',
      'JAVASCRIPT:alert(1)',
      'data:text/html,hi',
      '//example.com',
      '/\\example.com',
      'example.com',
      '',
    ])
      expect(safeLink(url), url).toBeNull()
  })
})

// The one place a URL from the content files becomes a link. It allows https:, mailto: and
// pages on this site. Anything else (http:, javascript:, //another-site) gives null, and the
// link is not shown. Links to other sites get rel="noopener noreferrer".
export function safeLink(url: string): { href: string; rel?: string } | null {
  if (url.startsWith('https://')) return { href: url, rel: 'noopener noreferrer' }
  if (url.startsWith('mailto:')) return { href: url }
  // A path on this site starts with one slash. "//host" and "/\host" both leave the site.
  if (/^\/(?![/\\])/.test(url)) return { href: url }
  return null
}

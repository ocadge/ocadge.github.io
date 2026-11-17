// What I'm working on right now, shown in the hero. Update this file as things change.

export type NowStatus = 'building' | 'starting' | 'planning'

export interface NowItem {
  id: 'site' | 'explorer' | 'bootcamp'
  tab: string
  status: NowStatus
  title: string
  summary: string
  link?: { href: string; label: string }
}

export const nowItems: NowItem[] = [
  {
    id: 'site',
    tab: 'This site',
    status: 'building',
    title: 'This portfolio',
    summary:
      'Rebuilt from scratch in React and TypeScript using Claude Code, working from my own written specification. Every change goes through a pull request with automated tests and security scans, and I review each one before merging it.',
    link: { href: 'https://github.com/ocadge/ocadge.github.io', label: 'See the code' },
  },
  {
    id: 'explorer',
    tab: 'Explorer',
    status: 'building',
    title: 'EU Life Expectancy Explorer',
    summary:
      'Interactive charts of Eurostat data for all 27 EU countries, growing out of my university report.',
    link: { href: '/explorer/', label: 'Try the explorer' },
  },
  {
    id: 'bootcamp',
    tab: 'Bootcamp',
    status: 'starting',
    title: 'AI Essentials Bootcamp',
    summary: 'Ten days of training, 23 November to 4 December 2026.',
  },
]

export const siteSteps = [
  { label: 'Foundations and checks', done: true },
  { label: 'Design and layout', done: true },
  { label: 'Content and projects', done: true },
  { label: 'Contact and launch', done: true },
]

export const bootcampTopics = [
  'Using generative AI tools',
  'Writing effective prompts',
  'Fact-checking AI output',
  'Responsible use and data protection',
  'Mapping processes for automation',
]

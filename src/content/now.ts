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
      'Rebuilt from scratch in React and TypeScript, one phase at a time, with automated checks on every change.',
    link: { href: 'https://github.com/ocadge/ocadge.github.io', label: 'See the code' },
  },
  {
    id: 'explorer',
    tab: 'Explorer',
    status: 'building',
    title: 'EU Life Expectancy Explorer',
    summary:
      'Interactive charts of Eurostat data for all 27 EU countries, growing out of my university report.',
    link: { href: '/explorer/', label: 'Try the work in progress' },
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
  { label: 'Design and layout', done: false },
  { label: 'Content and projects', done: false },
  { label: 'Contact and launch', done: false },
]

export const bootcampTopics = [
  'Using generative AI tools',
  'Writing effective prompts',
  'Fact-checking AI output',
  'Responsible use and data protection',
  'Mapping processes for automation',
]

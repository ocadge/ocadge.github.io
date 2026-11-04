// The site version of my CV. Sources: my CVs and skills profile in the vault.
// Left out on purpose: home address, phone number, town, and the names of the school, college,
// university, employer and training provider. Phase 2 adds a schema check.

export interface Fact {
  label: string
  value: string
}

export interface TimelineEntry {
  dates: string
  title: string
  place: string
  summary: string
  current?: boolean
}

export interface SkillGroup {
  name: string
  skills: string[]
}

export const about = {
  headline: 'Early-career developer with studio experience',
  paragraphs: [
    'I’m an early-career developer from the North East. I spent a year as a Games Programming Intern at an independent games studio, working in a small team on a client prototype in Unreal Engine 5, then studied Computer Science at university, where I earned a Certificate of Higher Education in Computing with Commendation.',
    'Python is my strongest language. At university I built object-oriented desktop apps in PySide6, a REST API in PHP and data visualisation reports with pandas and seaborn. Right now I’m building this site in React and TypeScript, and I’m enrolled on an AI Essentials Bootcamp.',
  ],
  facts: [
    { label: 'location', value: 'North East England' },
    { label: 'education', value: 'CertHE Computing, Commendation' },
    { label: 'focus', value: 'Python and data' },
    { label: 'status', value: 'Open to apprenticeships and junior roles' },
  ] satisfies Fact[],
}

export const skillGroups: SkillGroup[] = [
  {
    name: 'Languages',
    skills: ['Python', 'SQL', 'PHP', 'HTML and CSS', 'JavaScript and TypeScript (learning)'],
  },
  { name: 'Data', skills: ['pandas', 'matplotlib', 'seaborn', 'SQLite', 'Data visualisation design'] },
  { name: 'Frameworks and engines', skills: ['PySide6', 'Flask', 'React (learning)', 'Unreal Engine 5'] },
  { name: 'Tools and practices', skills: ['Git and GitHub', 'Perforce', 'Jira', 'Unit testing', 'Figma'] },
]

export const timeline: TimelineEntry[] = [
  {
    dates: 'Nov 2026 – Dec 2026',
    title: 'AI Essentials Bootcamp (enrolled)',
    place: 'Training provider',
    summary:
      'A ten-day bootcamp on using generative AI tools responsibly, checking AI output and mapping workplace processes for automation.',
    current: true,
  },
  {
    dates: '2023 – 2026',
    title: 'Certificate of Higher Education in Computing, Commendation',
    place: 'University',
    summary:
      'Exit award from BSc (Hons) Computer Science. Modules passed include Programming, Advanced Programming, Algorithms and Data Structures, Software Architecture, Data Visualization, Data Fundamentals and AI Fundamentals.',
  },
  {
    dates: 'Jan 2022 – Jan 2023',
    title: 'Games Programming Intern',
    place: 'Independent games studio',
    summary:
      'Worked in a small independent team prototyping a client project in Unreal Engine 5. Built features and fixed technical issues, joined daily stand-ups with the client, and used Perforce for version control and Jira for tasks.',
  },
  {
    dates: '2021 – 2023',
    title: 'T Level in Digital Production, Design and Development, Merit',
    place: 'College',
    summary:
      'Included a year-long industry placement and an employer-set project: a desktop app showing weather and air quality on a map, with health advice for people with heart or lung conditions.',
  },
  {
    dates: '2016 – 2021',
    title: 'GCSEs',
    place: 'Secondary school',
    summary: 'Nine GCSEs at grades 5 and 6, including 6 in Maths, English Language and Computer Science.',
  },
]

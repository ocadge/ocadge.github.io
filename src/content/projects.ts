// My projects, shown in the Projects section. Rules (checked by projects.test.ts):
// university code is never public, so those projects can't have a code link, and every
// card says how a visitor can see the work.

export type ProjectGroup = 'tlevel' | 'university' | 'personal'
export type ProjectView = 'live' | 'screenshots' | 'writeup'

export interface ProjectImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface Project {
  id: string
  title: string
  group: ProjectGroup
  view: ProjectView
  summary: string
  built: string
  learned: string
  tags: string[]
  codePublic: boolean
  links: { live?: string; code?: string }
  images?: ProjectImage[]
  note?: string
}

export const groups: { id: ProjectGroup; label: string }[] = [
  { id: 'tlevel', label: 'T Level' },
  { id: 'university', label: 'University' },
  { id: 'personal', label: 'Personal' },
]

export const projects: Project[] = [
  {
    id: 'health-app',
    title: 'Environmental Health Advice App',
    group: 'tlevel',
    view: 'writeup',
    summary:
      'A desktop app that shows weather and air quality on a map, with health advice for people with heart or lung conditions.',
    built:
      'My employer-set project. It finds your location, pulls live data from the OpenWeatherMap and World Air Quality Index APIs, and gives advice by UK air quality band, with a steps-to-calories tracker and dark mode. Every request is logged to SQLite.',
    learned:
      'Working with REST APIs and JSON, planning with requirements, flowcharts and a test log, and keeping API keys out of code: my first version had them written in, so I moved them into a .env file.',
    tags: ['Python', 'customtkinter', 'REST APIs', 'SQLite'],
    codePublic: true,
    links: { code: 'https://github.com/ocadge/health-advice-app' },
  },
  {
    id: 'survey-app',
    title: 'Student Survey App',
    group: 'tlevel',
    view: 'screenshots',
    summary:
      'A mobile survey app made in MIT App Inventor: tap a rating from 1 to 5 and it is saved to a Google Sheet.',
    built:
      'The app sends each rating to a small Google Apps Script web app, which writes it into the sheet and can read every response back.',
    learned: 'How a mobile app talks to a web service, and how block-based logic maps onto ordinary code.',
    tags: ['MIT App Inventor', 'Google Apps Script', 'JavaScript'],
    codePublic: false,
    links: {},
    images: [
      {
        src: '/images/projects/survey-app.webp',
        alt: 'The survey app on a phone screen: a New Response button above five coloured rating buttons numbered 1 to 5.',
        width: 375,
        height: 684,
      },
      {
        src: '/images/projects/survey-apps-script.webp',
        alt: 'The Google Apps Script code that reads all responses from the sheet or saves a new one.',
        width: 873,
        height: 572,
      },
    ],
  },
  {
    id: 'pandas',
    title: 'Early data analysis with pandas',
    group: 'tlevel',
    view: 'screenshots',
    summary:
      'My first steps with Python data tools in Google Colab: loading CSV files into pandas and charting them with matplotlib.',
    built:
      'Notebooks that load and filter data, such as sales by region and a movie dataset, and draw bar, line, area, pie and histogram charts.',
    learned:
      'The basics of DataFrames and plotting, which I later built on for my university data visualisation reports.',
    tags: ['Python', 'pandas', 'matplotlib', 'Google Colab'],
    codePublic: false,
    links: {},
    images: [
      {
        src: '/images/projects/pandas-subplots.webp',
        alt: 'Four small line charts stacked vertically, one for each column of a practice dataset.',
        width: 552,
        height: 490,
      },
      {
        src: '/images/projects/pandas-stacked-bar.webp',
        alt: 'A stacked bar chart with four coloured segments per bar.',
        width: 388,
        height: 288,
      },
    ],
  },
  {
    id: 'housing',
    title: 'On-Licence Housing Allocation System',
    group: 'university',
    view: 'writeup',
    summary:
      'A desktop app that matches people released on licence to suitable rehabilitation housing, scoring each match and flagging conflicts.',
    built:
      'Each matching rule, such as curfew support, accessibility, distance from schools or offending triggers, is its own class that returns a score and a plain-English warning. Weighted scores rank the best units, and a hard conflict is flagged as critical. It also has a login screen, a test-data generator and forms to manage units.',
    learned:
      'Designing with polymorphism so new rules plug in without changing the rest, and writing warnings a non-technical caseworker can act on.',
    tags: ['Python', 'PySide6', 'Object-oriented design'],
    codePublic: false,
    links: {},
  },
  {
    id: 'php-api',
    title: 'REST API in PHP',
    group: 'university',
    view: 'writeup',
    summary: 'A web API for a conference database of authors, presentations and presentation types.',
    built:
      'One entry point routes each URL to its handler and returns JSON. Requests need a bearer token checked by middleware, database queries use prepared statements to block SQL injection, and results can be filtered and paginated.',
    learned:
      'Keeping routing, middleware and data access separate, and what clear status codes such as 401, 404 and 405 tell the caller.',
    tags: ['PHP', 'REST API', 'PDO', 'MySQL'],
    codePublic: false,
    links: {},
  },
  {
    id: 'data-vis',
    title: 'Data visualisation reports',
    group: 'university',
    view: 'writeup',
    summary:
      'Two reports turning open data into charts: Gapminder world development data, and Eurostat life expectancy across the EU.',
    built:
      'I chose each chart to fit its question: a log-scale scatter for GDP, then a line chart, lollipop chart, heatmap and dumbbell chart for life expectancy, with colour-blind-safe palettes and comparison countries kept visible to avoid cherry-picking.',
    learned:
      'Choosing charts from the task (Munzner) and how accurately people read different encodings (Cleveland and McGill). This work grew into my EU Life Expectancy Explorer.',
    tags: ['Python', 'pandas', 'seaborn', 'matplotlib'],
    codePublic: false,
    links: {},
  },
  {
    id: 'profiling',
    title: 'Profiling code on large datasets',
    group: 'university',
    view: 'writeup',
    summary:
      'Finding and fixing slow Python on real datasets: supermarket transactions and nearly a million network-traffic records.',
    built:
      'I used cProfile to find where the time went, then swapped slow list searches for dictionaries and sets. One sales report took minutes because it searched a list for every transaction.',
    learned: 'Measure before optimising, and the right data structure matters more than clever tricks.',
    tags: ['Python', 'cProfile', 'Big-O'],
    codePublic: false,
    links: {},
  },
  {
    id: 'bike-line',
    title: 'Bike Production Line Manager',
    group: 'university',
    view: 'writeup',
    summary:
      'A desktop app for a bicycle maker that tracks each order through an 11-step production line and keeps the parts stock accurate.',
    built:
      'Orders carry the customer’s choices (frame size, wheels, gears, brakes and lights) and can only move to the next step in order. Each step uses parts from stock and is blocked if they run out, low stock shows in red, and every part used is logged against its order. The rules live in Inventory, BikeOrder and ProductionLine classes, separate from the screens.',
    learned:
      'Modelling a process as a fixed sequence of states, and using Qt signals and slots so both screens update themselves when stock changes.',
    tags: ['Python', 'PySide6', 'Qt signals and slots'],
    codePublic: false,
    links: {},
  },
  {
    id: 'meal-planner',
    title: 'Meal Planner web app',
    group: 'university',
    view: 'writeup',
    summary: 'A web app for planning a week of meals, saving recipes and keeping a grocery list.',
    built:
      'Flask routes and pages for meal plans, recipes, groceries and settings (theme, font size and first day of the week). Forms use WTForms to validate input, with protection against cross-site form submission built in. Data is held in memory, so it resets when the server restarts.',
    learned:
      'How routes, templates and forms fit together in a web app, and why input validation matters. Saving the data in SQLite would be my next step.',
    tags: ['Python', 'Flask', 'WTForms', 'HTML'],
    codePublic: false,
    links: {},
  },
  {
    id: 'explorer',
    title: 'EU Life Expectancy Explorer',
    group: 'personal',
    view: 'live',
    summary:
      'Interactive charts of life expectancy across all 27 EU countries, 2000 to 2024, using Eurostat data.',
    built:
      'A React and TypeScript page built on Eurostat data. You can switch between men, women and total, and pick countries to compare against the EU average. The trend chart is live; gender gap, heatmap and recovery charts are next.',
    learned:
      'Building with React and TypeScript, and keeping charts accessible with text summaries and colours that work in both light and dark mode.',
    tags: ['React', 'TypeScript', 'Recharts', 'Eurostat data'],
    codePublic: true,
    links: { live: '/explorer/', code: 'https://github.com/ocadge/ocadge.github.io/tree/main/src/explorer' },
    note: 'Work in progress, built with AI assistance.',
  },
]

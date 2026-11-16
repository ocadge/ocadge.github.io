# ocadge.github.io

My portfolio site, built with Vite, React and TypeScript, and published at https://ocadge.github.io.

## Run it locally

Needs Node 24.

```bash
npm ci --ignore-scripts
npm run dev
```

Then open http://localhost:5173 (portfolio) or http://localhost:5173/explorer/ (EU Life Expectancy Explorer).

## Commands

| Command             | What it does                                                  |
| ------------------- | ------------------------------------------------------------- |
| `npm run dev`       | Local server that reloads when you save                       |
| `npm run build`     | Type-checks, then builds the static site into `dist/`         |
| `npm run typecheck` | TypeScript checks only                                        |
| `npm run lint`      | ESLint, including the rules that ban raw HTML and `eval`      |
| `npm run format`    | Formats every file with Prettier (`format:check` only checks) |
| `npm test`          | Unit tests (Vitest)                                           |
| `npm run e2e`       | End-to-end and axe accessibility tests against the built site |

The end-to-end tests need a build first (`npm run build`) and a one-time browser download (`npx playwright install chromium`). They start `npm run preview` themselves.

Every push to `main` builds the site and publishes `dist/` to GitHub Pages. CI runs all the checks, including the end-to-end tests, plus `npm audit` and a gitleaks secret scan, on every pull request. Lighthouse scores for the live site are in `docs/lighthouse.md`. GitHub's CodeQL default setup (turned on in the repo settings) scans the code on every pull request and weekly.

## Layout

```text
.github/       CI, deploy, Dependabot, CODEOWNERS
docs/          Lighthouse results (not published)
e2e/           Playwright end-to-end and accessibility tests
explorer/      HTML page for the explorer demo
404.html       the page GitHub Pages shows for unknown addresses
public/        files served as they are: fonts (with their licences), images, cv.pdf, robots.txt, sitemap.xml, security.txt
src/           React code: components/ (one folder each, with a CSS Module), content/, lib/, styles/, explorer/
```

The security policy (CSP) is added to every built page by a small plugin in `vite.config.ts`. It isn't used by `npm run dev`, because hot reload needs inline scripts, so check anything that loads from a new place with `npm run build` and `npm run e2e`.

## Changing the content

All the words on the site live in `src/content/`, so most updates don't touch a component:

| File          | What it holds                                                 |
| ------------- | ------------------------------------------------------------- |
| `projects.ts` | Project cards (see below)                                     |
| `now.ts`      | The "Right now" panel in the hero; update it as things change |
| `cv.ts`       | About, skills and the experience timeline                     |

To replace the CV, export the new PDF without personal details (no phone, email or town) and save it over `public/cv.pdf`.

## Adding a project

1. Open `src/content/projects.ts` and copy an existing entry in the `projects` list.
2. Fill in every field. `group` decides which tab it appears under, and `view` says how a visitor sees it: `live` needs a `links.live`, `screenshots` needs `images`.
3. For screenshots, save them as `.webp` in `public/images/projects/` and give each one alt text and its real width and height.
4. Set `codePublic: false` for anything that mustn't be shared (all university work). Those can't have a `links.code`.
5. Run `npm test`. The tests in `src/content/projects.test.ts` fail if a rule is broken, and CI won't let the change merge until they pass.

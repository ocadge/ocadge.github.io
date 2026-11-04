# ocadge.github.io

Ben Wilkinson's portfolio site, built with Vite, React and TypeScript. It's being rebuilt in phases; this is Phase 0 (foundations).

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

Every push to `main` builds the site and publishes `dist/` to GitHub Pages. CI runs all the checks, plus `npm audit` and a gitleaks secret scan, on every pull request. GitHub's CodeQL default setup (turned on in the repo settings) scans the code on every pull request and weekly.

## Layout

```text
.github/       CI, deploy, Dependabot, CODEOWNERS
explorer/      HTML page for the explorer demo
public/fonts/  self-hosted Bricolage Grotesque, Silkscreen and IBM Plex Sans, with their licences
src/           React code: components/ (one folder each, with a CSS Module), styles/ (tokens, fonts, global), explorer/
```

## Adding a project

1. Open `src/content/projects.ts` and copy an existing entry in the `projects` list.
2. Fill in every field. `group` decides which tab it appears under, and `view` says how a visitor sees it: `live` needs a `links.live`, `screenshots` needs `images`.
3. For screenshots, save them as `.webp` in `public/images/projects/` and give each one alt text and its real width and height.
4. Set `codePublic: false` for anything that mustn't be shared (all university work). Those can't have a `links.code`.
5. Run `npm test`. The tests in `src/content/projects.test.ts` fail if a rule is broken, and CI won't let the change merge until they pass.

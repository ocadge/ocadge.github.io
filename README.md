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

CI runs all the checks, plus `npm audit` and a gitleaks secret scan, on every pull request. CodeQL scans the code on every pull request and weekly.

## Layout

```text
.github/       CI, CodeQL, Dependabot, CODEOWNERS
explorer/      HTML page for the explorer demo
src/           React code (src/explorer is the explorer demo)
```

## Adding a project

Coming in Phase 2, when projects move into typed data files.

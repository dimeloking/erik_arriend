<!-- NEXT-AGENTS-MD-START -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

## Available Skills

Use these skills for detailed patterns on-demand. Skills live in `.agents/skills/` and are tracked by `skills-lock.json`.

### Generic Skills (Any Project)
| Skill | Description | URL |
|-------|-------------|-----|
| `agents-md-maintainer` | Keep AGENTS.md aligned with local skills, commands, workflows, hooks, and Codex automation prompts | [SKILL.md](.agents/skills/agents-md-maintainer/SKILL.md) |
| `skill-creator` | Create or update Codex skills with concise workflows and bundled resources | [SKILL.md](.agents/skills/skill-creator/SKILL.md) |
| `skill-installer` | Install Codex skills from curated lists or GitHub repo paths | [SKILL.md](.agents/skills/skill-installer/SKILL.md) |
| `typescript-advanced-types` | Utility types, generics, conditional types, mapped types, narrowing | [SKILL.md](.agents/skills/typescript-advanced-types/SKILL.md) |
| `nodejs-best-practices` | General Node.js architecture, async, modules, security, and performance | [SKILL.md](.agents/skills/nodejs-best-practices/SKILL.md) |
| `nodejs-backend-patterns` | Backend services, route handlers, errors, layering, middleware patterns | [SKILL.md](.agents/skills/nodejs-backend-patterns/SKILL.md) |
| `vitest` | Unit tests, mocks, coverage, and Vitest configuration | [SKILL.md](.agents/skills/vitest/SKILL.md) |
| `playwright-best-practices` | E2E tests, selectors, Page Object Model, debugging, CI patterns | [SKILL.md](.agents/skills/playwright-best-practices/SKILL.md) |
| `accessibility` | WCAG, ARIA, keyboard navigation, focus management, contrast | [SKILL.md](.agents/skills/accessibility/SKILL.md) |
| `seo` | Metadata, sitemap, robots, Open Graph, structured data | [SKILL.md](.agents/skills/seo/SKILL.md) |
| `oxlint` | Oxlint and Ultracite linting rules and fixes | [SKILL.md](.agents/skills/oxlint/SKILL.md) |

### Next.js Boilerplate Skills
| Skill | Description | URL |
|-------|-------------|-----|
| `next-best-practices` | Next.js App Router, RSC, Server Actions, routing, metadata, async APIs | [SKILL.md](.agents/skills/next-best-practices/SKILL.md) |
| `next-cache-components` | Cache Components, `use cache`, `cacheLife`, `cacheTag`, revalidation | [SKILL.md](.agents/skills/next-cache-components/SKILL.md) |
| `next-upgrade` | Upgrade and migrate Next.js versions with official guides and codemods | [SKILL.md](.agents/skills/next-upgrade/SKILL.md) |
| `react-best-practices` | React 19 patterns, React Compiler, component structure, rerender hygiene | [SKILL.md](.agents/skills/react-best-practices/SKILL.md) |
| `composition-patterns` | Slots, children, compound components, render props, component APIs | [SKILL.md](.agents/skills/composition-patterns/SKILL.md) |
| `frontend-design` | Visual hierarchy, layout, spacing, responsive UI, product-quality screens | [SKILL.md](.agents/skills/frontend-design/SKILL.md) |
| `tailwind-css-patterns` | Tailwind CSS 4 utilities, responsive styling, dark mode, component styling | [SKILL.md](.agents/skills/tailwind-css-patterns/SKILL.md) |
| `drizzle` | Drizzle ORM schemas, queries, migrations, performance patterns | [SKILL.md](.agents/skills/drizzle/SKILL.md) |
| `neon-drizzle` | Provision/connect Neon Postgres with Drizzle: connection string, driver choice (node-postgres / neon-http / neon-serverless), migrations | [SKILL.md](.agents/skills/neon-drizzle/SKILL.md) |
| `react-hook-form` | React Hook Form validation, controllers, arrays, performance patterns | [SKILL.md](.agents/skills/react-hook-form/SKILL.md) |
| `zod` | Zod schemas, parsing, errors, type inference, validation composition | [SKILL.md](.agents/skills/zod/SKILL.md) |
| `swr` | Client-side data fetching, cache, revalidation, mutations, pagination, and optimistic UI with SWR | [SKILL.md](.agents/skills/swr/SKILL.md) |

### Clerk Skills
| Skill | Description | URL |
|-------|-------------|-----|
| `clerk` | Clerk overview and project-level auth guidance | [SKILL.md](.agents/skills/clerk/SKILL.md) |
| `clerk-setup` | Install and configure Clerk in a project | [SKILL.md](.agents/skills/clerk-setup/SKILL.md) |
| `clerk-nextjs-patterns` | Clerk middleware/proxy, `auth()`, Server Components, Server Actions | [SKILL.md](.agents/skills/clerk-nextjs-patterns/SKILL.md) |
| `clerk-react-patterns` | Clerk React hooks such as `useUser`, `useAuth`, and `useClerk` | [SKILL.md](.agents/skills/clerk-react-patterns/SKILL.md) |
| `clerk-custom-ui` | Custom sign-in/sign-up flows and component appearance | [SKILL.md](.agents/skills/clerk-custom-ui/SKILL.md) |
| `clerk-orgs` | Organizations, roles, multi-tenant workspaces, invitations | [SKILL.md](.agents/skills/clerk-orgs/SKILL.md) |
| `clerk-backend-api` | Server-side Clerk Backend API calls and user/org management | [SKILL.md](.agents/skills/clerk-backend-api/SKILL.md) |
| `clerk-webhooks` | Clerk webhooks with Svix verification | [SKILL.md](.agents/skills/clerk-webhooks/SKILL.md) |
| `clerk-testing` | Testing Clerk-protected flows with Playwright or Cypress | [SKILL.md](.agents/skills/clerk-testing/SKILL.md) |

### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action | Skill |
|--------|-------|
| Add or modify a page/route in `src/app/` | `next-best-practices` |
| Work on App Router, Server Components, Server Actions, or `"use server"` | `next-best-practices` |
| Read or change Next.js async APIs: `params`, `searchParams`, `cookies()`, `headers()` | `next-best-practices` |
| Add or adjust metadata, `generateMetadata`, OG images, sitemap, robots, or JSON-LD | `seo` |
| Add or adjust cache behavior, `use cache`, `cacheLife`, `cacheTag`, `revalidate`, or `unstable_cache` | `next-cache-components` |
| Upgrade or migrate Next.js | `next-upgrade` |
| Write or refactor React components | `react-best-practices` |
| Design component APIs with slots, children, compound components, or render props | `composition-patterns` |
| Make UI layout, spacing, visual hierarchy, responsive design, or mockup decisions | `frontend-design` |
| Write or adjust Tailwind classes, hover states, gradients, borders, dark mode, or responsive styles | `tailwind-css-patterns` |
| Configure Clerk for the first time | `clerk-setup` |
| Protect routes, configure Clerk middleware/proxy, or read `auth()` on the server | `clerk-nextjs-patterns` |
| Use Clerk hooks like `useUser`, `useAuth`, or `useClerk` in client components | `clerk-react-patterns` |
| Build custom Clerk sign-in or sign-up forms | `clerk-custom-ui` |
| Work with Clerk organizations, roles, invitations, or multi-tenant auth | `clerk-orgs` |
| Make server-side calls to the Clerk Backend API | `clerk-backend-api` |
| Receive or verify Clerk webhooks | `clerk-webhooks` |
| Test Clerk-protected flows | `clerk-testing` |
| Ask a general Clerk question in this repo | `clerk` |
| Define or modify Drizzle schema, queries, migrations, or database models | `drizzle` |
| Connect, configure, or troubleshoot Neon Postgres (DATABASE_URL, driver choice, edge runtime, pooler endpoint) | `neon-drizzle` |
| Set up Drizzle with a fresh Neon database, switch from PGlite to Neon, or change adapter (`node-postgres` ↔ `neon-http` ↔ `neon-serverless`) | `neon-drizzle` |
| Errors: `connect ECONNREFUSED`, `password authentication failed`, `SSL/TLS required`, `too many connections` against Neon | `neon-drizzle` |
| Create a client form with validation | `react-hook-form` + `zod` |
| Create or adjust Zod schemas | `zod` |
| Client-side data fetching, SWR cache/revalidation, mutations, optimistic UI, pagination, or infinite loading | `swr` |
| Write advanced TypeScript types, generics, conditional types, or mapped types | `typescript-advanced-types` |
| Create API route handlers, server logic, backend errors, or middleware | `nodejs-backend-patterns` |
| Ask general Node.js architecture, async, module, performance, or security questions | `nodejs-best-practices` |
| Write unit tests, component tests, hooks tests, or Vitest config | `vitest` |
| Write integration tests or E2E tests with Playwright | `playwright-best-practices` |
| Fix Oxlint, Ultracite, or type-aware lint warnings | `oxlint` |
| Review or improve accessibility, ARIA, keyboard navigation, or contrast | `accessibility` |
| Create or update a Codex skill | `skill-creator` |
| Ask how to design a skill, reduce skill token usage, or structure skill resources | `skill-creator` |
| Install a Codex skill from a curated list, GitHub repo, or path | `skill-installer` |
| List available installable Codex skills | `skill-installer` |
| Sync `AGENTS.md` with `.agents/skills`, package scripts, repo workflows, hooks, or Codex automation prompts | `agents-md-maintainer` |

### AGENTS.md Sync Workflow

- Keep the skill tables aligned with actual directories in `.agents/skills/`; that folder is the source of truth.
- When a new local skill appears, read its `SKILL.md` and add the narrowest useful auto-invoke row. If the trigger is unclear, add `PENDIENTE: revisar disparador para <skill>` instead of inventing one.
- Preserve the generated Next.js docs block and existing repo-specific rules; only edit the sections needed for skills, workflows, or commands discovered in the repo.

---

## Project Overview

This repository is a Next.js boilerplate for building a production-ready web app from scratch.

| Component | Location | Tech Stack |
|-----------|----------|------------|
| App Router | `src/app/` | Next.js 16, React 19, Server Components |
| Components | `src/components/` | React 19, TypeScript, Tailwind CSS 4 |
| Auth | `src/app/[locale]/(auth)/`, `src/libs/` | Clerk |
| Database | `src/models/`, `migrations/` | Drizzle ORM, PostgreSQL, PGlite local DB, Neon production DB |
| Styles | `src/styles/global.css` | Tailwind CSS 4, CSS-first theme tokens |
| i18n | `src/locales/`, `src/libs/I18n.ts` | next-intl, Crowdin |
| Tests | `src/**/*.test.*`, `tests/` | Vitest, Vitest Browser mode, Playwright |
| Tooling | root config files | Oxlint, Oxfmt, Ultracite, Lefthook, Commitlint, Knip |
| Monitoring | `checkly.config.ts`, Sentry config | Checkly, Sentry, LogTape, Better Stack |

---

## Development

```bash
# Install dependencies
npm install

# Start local development
npm run dev

# Production-like local build with temporary in-memory DB
npm run build-local
```

Use Node.js 22+ when possible. The README currently says Node.js 22+, while `package.json` allows `>=20`; prefer the README requirement for this boilerplate.

---

## Code Quality

```bash
# Lint with Ultracite/Oxlint
npm run lint

# Fix lint/format issues
npm run lint:fix

# Type-check the whole project
npm run check:types

# Find unused files and dependencies
npm run check:deps

# Check i18n messages
npm run check:i18n
```

- This repo uses **Oxlint + Ultracite** instead of ESLint.
- This repo uses **Oxfmt** instead of Prettier.
- This repo uses **Lefthook** instead of Husky.
- Do not reformat unrelated files.
- Keep TypeScript strict. Avoid `any` unless isolated and justified.
- Let the compiler infer return types unless an annotation improves clarity.
- Use absolute imports via `@/` unless importing from the same directory.
- Follow existing config in `oxlint.config.ts`, `oxfmt.config.ts`, and `lefthook.yml`.

---

## Database

```bash
# Generate a migration after changing src/models/Schema.ts
npm run db:generate

# Apply migrations
npm run db:migrate

# Explore the database
npm run db:studio
```

- Database schema lives in `src/models/Schema.ts`.
- Migrations live in `migrations/`.
- Local development uses PGlite.
- Production should use a PostgreSQL provider such as Neon.
- Environment variables must be validated through the project env layer. Do not read `process.env` directly in app code unless you are inside config/bootstrap files that already follow the repo pattern.

---

## Testing

```bash
# Unit and component tests
npm run test

# Integration and E2E tests
npm run test:e2e
```

- `*.test.ts` and `*.test.tsx` are unit/component tests.
- `*.spec.ts` files are integration tests.
- `*.e2e.ts` files are Playwright E2E tests.
- Keep unit tests close to implementation. Keep integration and E2E tests in `tests/`.
- Avoid mocking unless it is necessary.

---

## React, Next.js, And Styling

- Before any Next.js code change, read the relevant file in `node_modules/next/dist/docs/`.
- Default exports are allowed for Next.js pages/layouts; prefer named exports elsewhere.
- Locale pages use `props: { params: Promise<{ locale: string }> }`, then `await props.params`, then `setRequestLocale(locale)`.
- Dashboard pages sit behind auth. Define dashboard metadata in layout when possible.
- Never hard-code user-visible strings in localized pages. Use `getTranslations` on the server and `useTranslations` on the client.
- Use Tailwind CSS 4 utility classes and existing theme tokens from `src/styles/global.css`.
- Reuse shared components before creating new ones.
- No unnecessary `useEffect`.
- Do not add `useMemo` or `useCallback` unless the repo has a documented exception.
- Use `React.ReactNode`, not imported `ReactNode`.

---

## Commit & Pull Request Guidelines

Follow conventional commits:

```text
type: short specific summary
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Before committing or opening a PR:

1. Run the relevant checks.
2. Include UI screenshots for visible UI changes.
3. Keep the summary specific to the changed behavior or file area.
4. Do not include unrelated formatting or generated churn.

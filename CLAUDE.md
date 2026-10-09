# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Project

"Casero": rental-control app for a landlord (properties, tenants, monthly rent payments, extra payments, expenses, running balance). Built on the ixartz Next.js boilerplate: Next.js 16.4 App Router with Cache Components and Partial Prefetching on, React 19.3 with the Rust React Compiler on in every build, Tailwind v4, Clerk, Drizzle + PostgreSQL (PGlite locally, Neon in production), next-intl, Sentry, Arcjet. Domain code lives in `src/features/casero/`; `README.md` is the untouched boilerplate README.

`doc/` is a reference prototype kept for client onboarding (excluded from lint via `.oxlintignore`). `agents-md/AGENTS.md` is an unrelated template from another project; ignore it. Also ignore `.agents/skills/typescript-advanced-types copy` (stale duplicate skill directory).

## Commands

- `npm run dev`: starts a PGlite server on `local.db` (runs migrations) plus `next dev`. The `db-server:*` scripts shell out through `cmd /c`, so local dev and `build-local` only work on Windows.
- `npm run build-local`: production build against an in-memory PGlite database. `npm run build` runs `db:migrate` against `DATABASE_URL` first.
- Check gate: `npm run lint` (Ultracite, type-aware, explicit file list), `check:types`, `check:deps` (Knip). `next lint` does not exist in Next 16. Also `check:i18n` (`-s en`) and `test`. Lefthook pre-commit runs Ultracite fix and Knip; commit-msg runs commitlint.
- Tests: `npm test` runs Vitest with two projects, `unit` (node, `src/**/*.test.{js,ts}`) and `ui` (Chromium via Playwright, `*.test.tsx`). Single file: `npx vitest run --project unit <path>`. `npm run test:e2e` runs Playwright (`tests/e2e/*.e2e.ts`). The `ui` project needs Playwright Chromium (`npx playwright install chromium`); without it only `unit` runs. There is no test coverage for `src/features/casero`.
- Database commands (`db:generate`, `db:migrate`, `db:studio`) and `dev`, `build`, `storybook*` need explicit user approval. Never use `drizzle-kit push`; use reviewable migrations. If Drizzle asks whether a table was created or renamed, stop and ask.

## Architecture

- Rendering: every route runs under Cache Components. Layouts and pages stay sync-shell friendly: runtime reads (`auth()`, `currentUser()`, DB queries) sit under a `<Suspense>` or the segment's `loading.tsx` (the dashboard `TopBar` is wrapped in `<Suspense>`). `/[locale]` (marketing page) keeps `export const instant = false` with a TODO because its auth redirect needs a product decision. The sign-in catch-all page declares `generateStaticParams` so its shell prerenders. Never read the clock in a shared layout; the marketing footer year comes from a `'use cache'` helper.
- Routing: `src/proxy.ts` runs Arcjet bot detection (only when `ARCJET_KEY` is set), redirects every `/sign-up*` to `/sign-in` (sign-up is disabled for this client), then next-intl routing (`localePrefix: 'as-needed'`). Clerk middleware wraps only `/dashboard*`, `/sign-in*` and the home page (the home page redirects to dashboard or sign-in using `auth()`), because Clerk keyless mode does not work with i18n.
- Data access: reads are in `src/features/casero/queries.ts` (`server-only`), writes are `'use server'` actions in `actions.ts`, input validation is Zod in `validation.ts`. Actions return `{ ok: true } | { ok: false, errors: string[] }` instead of throwing, and call `revalidatePath`.
- Ownership: `property`, `expense` and `balance_snapshot` carry `userId` (Clerk). `payment` and `extra_payment` have no `userId`; they are owned through their property, so every action that touches them must first check the property belongs to `requireUserId()`.
- Payments are seeded lazily: `buildDuePayments` in `queries.ts` (and `computePaymentSeed` in `actions.ts`, a duplicate of the same logic) inserts missing `pending` rows for every month whose due day has passed, so reading properties can write to the DB. `payment` is unique per `(propertyId, month)`. Annual rent increase (`increasePct`, applied in `increaseAnchor` month) is applied during that generation. Editing a property overwrites the amount and tenant on all `pending` payments.
- `overdue` is never stored: `listPendingPaymentNotifications` derives it from the due date. Only `pending` and `paid` are ever written (validation accepts just those); `late` exists only as a type and a chip style.
- Balance (`balance-data.ts`): current balance = manual `balance_snapshot.balanceClp` + paid rent + extra payments − expenses. `DEFAULT_BALANCE_SNAPSHOT` in `queries.ts` hard-codes an opening balance of −3,588,087 for users without a snapshot.
- Money is stored as whole-number integers in `*Clp` columns and formatted with `es-CL`; the bank list in `lib.ts` is Colombian (`PAYMENT_METHODS`). Dates are `YYYY-MM-DD` / `YYYY-MM` varchar columns. Due-date math uses local time, while `todayISO()` is UTC-based.

## Rules and pitfalls

- UI copy is Spanish and hard-coded in `src/features/casero` (labels, validation messages, month names). next-intl (`en`, `fr`, default `en`, source locale for `check:i18n` is `en`) is used only by the boilerplate shell (layouts, `BaseTemplate`, `LocaleSwitcher`, user-profile metadata). Clerk is localized to Spanish for every locale. Sentry 11: `withSentryConfig` comes from `@sentry/nextjs/config`, `dataCollection` replaces `sendDefaultPii`, `consoleLoggingIntegration` replaces `enableLogs`. Do not move casero copy into locale files unless asked.
- Env: validate through `src/libs/Env.ts`; never read `process.env` directly in app code (only `src/proxy.ts` does, to keep the middleware small). Names: `DATABASE_URL`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`, `ARCJET_KEY`, `NEXT_PUBLIC_APP_URL`, plus optional logging, PostHog and Better Stack ones. Never read, print or store their values.
- Pinned on purpose (do not bump without a plan): `@clerk/nextjs` 7.5.1 (7.9 deprecates `createRouteMatcher`, used in `src/proxy.ts`; moving to resource-based auth checks is an auth decision), `ultracite` 7.8.3 + `oxlint` 1.69.0 + `oxfmt` 0.67.0 (newer builds add react-compiler and `function-component-definition` errors across casero components and reformat 12 files), `typescript` ^6.0.3, and the `@swc/core` 1.16.1 override (1.16.13 refuses to load on this machine because `%LOCALAPPDATA%` grants an AppContainer SID write rights). `typedRoutes` is off: next-intl links omit the `[locale]` segment, so every href fails `RouteImpl` typing.
- Lint: Ultracite/Oxlint + Oxfmt + Knip + Lefthook (not ESLint/Prettier/Husky). Central config is `oxlint.config.ts`; `.oxlintignore` already excludes `.agents/`, `doc/` and `migrations/`.
- Conventions: named exports except where Next.js needs defaults; absolute `@/` imports; no `any` or casts, prefer narrowing; no `useMemo`/`useCallback` (React Compiler); avoid unnecessary `useEffect`; `React.ReactNode`, not `ReactNode`. The locale comes from the `[locale]` root param (`next/root-params`, read in `src/libs/I18n.ts`); `setRequestLocale` and `requestLocale` are deprecated in next-intl 4.14 and no longer used. Only read `props.params` when the page needs the value (for example `getI18nPath`). Dashboard pages sit behind auth; define shared metadata in the layout.
- Tests: `*.test.ts(x)` co-located; `*.spec.ts` and `*.e2e.ts` in `tests/`. `it` titles in third-person present tense, sentence case, avoiding "should/works/handles"; avoid mocks unless necessary.
- Escape glob characters in shell commands against paths like `src/app/[locale]/`.
- Extra high-risk areas: Clerk changes, i18n architecture.

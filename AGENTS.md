# AGENTS.md

Next.js 16 App Router site (TypeScript, Tailwind 4) with Drizzle ORM over libSQL/Turso.

## Commands

- `npm run dev` / `npm run build` / `npm run lint`
- `npm run test:front` — Python/Playwright E2E suite (see Tests)
- DB: `npm run db:generate` → `db:migrate` → `db:seed` (in that order after schema changes)

## Language convention

The entire codebase is French: identifiers (`verifierMotDePasse`), comments, UI copy, DB columns (`motDePasseHash`). Match this — don't introduce English identifiers.

## Database

- Dev: local SQLite file `./soam.db` (gitignored). Prod: Turso via `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN`. Same code path (`lib/db.ts`), no separate dev adapter.
- Schema: `lib/schema.ts`. Migrations: `drizzle/`.
- `lib/content.ts` is the seed source of truth. `npm run db:seed` wipes and reinserts content from it (idempotent) and creates the admin account (`ADMIN_EMAIL`/`ADMIN_PASSWORD`, default `admin@soamgroup.net`/`admin123`).

## Admin portal

- CRUD is spec-driven: one generic list/form/action under `app/admin/(dash)/[entite]/`, driven by `ENTITES` in `lib/admin-entites.ts`. Adding a managed entity = new table in `lib/schema.ts` + entry in `ENTITES`; no new pages.
- Public reads go through `unstable_cache` tagged by `TAGS` (`lib/data.ts`); mutations in `app/api/admin/route.ts` call `revalidateTag(tag, "max")`. New cached reads must use a `TAGS` entry or pages will serve stale data.
- Auth is hand-rolled (no Auth.js): HMAC-signed cookie + scrypt hashes in `lib/auth.ts`, single admin account, secret from `AUTH_SECRET`.

## Tests

- `npm run test:front` runs plain Python (`tests/front/run.py`) — no Jest/Vitest. Needs the Python `playwright` package + chromium browser installed.
- It builds the app, serves it at port 3123 (`next start`), runs all `test_*.py`, exits nonzero on failure. `SKIP_BUILD=1` skips the rebuild when `.next` is fresh.
- Tests log in with the default seeded admin credentials and some read/write `soam.db` directly via sqlite3 — run `npm run db:seed` afterwards if you need pristine data.

## Misc

- Path alias `@/*` → repo root.
- `.env*` is gitignored; dev runs without any env file thanks to built-in defaults.

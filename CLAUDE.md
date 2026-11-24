# ABC Company demo site

Read `docs/state.md` first (where we are, what is next). How it runs and how editing works: `docs/server.md`.

- A portfolio demo for a FICTIONAL company. Keep all content clearly fictional: no real people,
  no real domains. Email shown: info@kiapmd.dev (real, Kia reads it). Phone: an obviously fake "000 0000 0000 (demo number)".
- The website is in `sveltekit-project/` (SvelteKit 3, pnpm). All words and pictures are JSON files in
  `sveltekit-project/src/content/`, edited at `/admin` (Sveltia CMS; forms in `static/admin/config.yml`).
- Checks, in `sveltekit-project/`: `pnpm check`, `pnpm lint`, `pnpm build`.
- Push to `master` = build and deploy (once the server move is done). Work on a branch; ask before pushing.
- Server work: read `D:\KIARASH\WORK\servers\kia-netherlands-vps\_server\CLAUDE.md` first.

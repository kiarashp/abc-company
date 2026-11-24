# Where we are (ABC Company demo site)

Read this first. Current picture only; git history has the story.
How the site runs and is edited: `docs/server.md`.

## What it is

A portfolio demo: website for a FICTIONAL consulting firm, "ABC Company". Kia's own work (built 2025).
Kia (24 Nov 2026): "it will be a portfolio fake website" — rewrite anything that needs it.
New address: **https://abc.kiapmd.dev** (Kia chose it 24 Nov 2026). Until 24 Nov 2026 it was on Vercel at
svelte-abc.kiapmd.dev (both deleted). Repo: github.com/kiarashp/abc-company (public; was svelte-company).
Folder on Kia's PC: `D:\KIARASH\WORK\servers\kia-netherlands-vps\abc-company` (was `to-polish\svelte-company`).

## State (24 Nov 2026)

**LIVE on https://abc.kiapmd.dev since 24 Nov 2026** (Kia's Netherlands server, box `abc-app-1`, healthy, ~20 MB).
`master` = the new version (push = test, build, deliver, ~3 min). Old Vercel version and svelte-abc.kiapmd.dev deleted 24 Nov.

Done and tested locally on the branch:
1. CMS: Sanity removed. Every word and picture is a JSON file in `sveltekit-project/src/content/`,
   edited with Sveltia CMS at `/admin` (saves to GitHub). "Log in with GitHub" is built into the site.
2. Security: contact form checked, plain-text email via Brevo, spam trap, 5/hour per visitor,
   **20/day total, count saved on a volume** so a restart can't reset it. `pnpm audit` = 0 known problems.
3. Speed/access: Lighthouse phone 94–98 speed, 100 for the rest; computer 100 in all four.
4. `/about-this-project` page with before/after numbers (written as Kia; Kia has not read it yet).
5. Content: clearly fictional. Get in touch shows info@kiapmd.dev (real, Kia reads it),
   "000 0000 0000 (demo number)", "12 Example Street, London (demo address)" (Kia: fakes must look fake).
6. Server files ready (`Dockerfile`, `compose.server.yml`, `deploy-hook.sh`, `deploy/receive-image.sh`,
   `.github/workflows/deploy.yml`, `.env.example`), all named **abc** (folder `/srv/abc`, box `abc-app-1`,
   Brevo key "abc", sender abc@kiapmd.dev). Box: hard limits, no swap, stopped first if memory runs out.

## Next (in order)

Done 24 Nov 2026: DNS A record `abc` (Porkbun); Brevo key "abc" + GitHub App "ABC Company editor" (only on
abc-company; replaced an OAuth App, see docs/server.md) in `/srv/abc/.env`; `/srv/abc` cloned; Caddy block
and auto-pull line pushed in the server repo; delivery key on the server + repo secrets; `cms-and-vps` merged
into `master` (= first real deploy).

1. (Done 24 Nov) First deploy: tests + delivery passed, box healthy, pages 200, /data writable, login goes to GitHub.
2. (Done 24 Nov) /admin login + save works end to end. Contact form tested 24 Nov: sent via Brevo, arrived in
   SPAM at info@kiapmd.dev (new sender abc@kiapmd.dev); Kia marks "Not spam" / adds a filter.
   Kia's test edit "From !! startups" in the home subtitle is live: undo it in /admin.
3. (Done 24 Nov) Vercel project deleted by Kia, Porkbun record `svelte-abc` removed: the old address no longer
   exists (no forwarding). Left: Kia revokes the old SendGrid key in SendGrid (it was only ever in Vercel).
4. Kia: delete the old OAuth App "ABC Company editor" if not done (GitHub > Developer settings > OAuth Apps).
5. Re-run Lighthouse on the live address; update the server's docs/server.md row (now "being set up");
   portfolio card in kiapmd-dev (`src/content/projects/abc.md`: github + demo links still old).

## Traps learned

- SvelteKit 3 changed a lot: settings live in `vite.config.ts` (no `svelte.config.js`), `$lib` → `#lib/…`
  with the file ending (`#lib/content/index.ts`), env vars are declared in `src/env.ts` and imported from
  `$app/env/private`, `Handle` type comes from `@sveltejs/kit/hooks`, `redirect()` refuses outside sites.
- The old version (commit edb0236) only builds with `SENDGRID_API_KEY=anything` set.
- Flat cartoon pictures got BIGGER when re-encoded smaller; only photos and the blurry circles shrank.
- Full-page screenshots leave lazy pictures as blank gaps: scroll first before judging.
- Lighthouse: a failed run can leave the old report file; delete the report before each run.
- Test: in `sveltekit-project/`, `pnpm build && PORT=4319 node build`, then open http://localhost:4319.
  `/admin` shows the editor login; real saving needs the GitHub login (after the move).
- Sveltia saves JSON with 2 spaces; Prettier wanted tabs, so the first real /admin save (24 Nov) failed `pnpm lint`
  and was not deployed. Fixed: `src/content/` is in `.prettierignore`. After CMS changes, test a REAL save end to end.
- Scripts committed from Windows lose their "runnable" mark: `git update-index --chmod=+x <file>` (the first
  deploy failed with "receive-image.sh: Permission denied").
- Moving a project folder with PowerShell's Move-Item: if Windows can't simply rename it, Move-Item copies and
  deletes file by file and stops halfway (read-only git files). Use `git clone` into the new place instead.

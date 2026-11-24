# Where we are (ABC Company demo site)

Read this first. Current picture only; git history has the story.
How the site runs and is edited: `docs/server.md`.

## What it is

A portfolio demo: website for a FICTIONAL consulting firm, "ABC Company". Kia's own work (built 2025).
Kia (24 Nov 2026): "it will be a portfolio fake website" — rewrite anything that needs it.
Live today (old version) on Vercel: https://svelte-abc.kiapmd.dev. Repo: github.com/kiarashp/svelte-company (public).

## State (24 Nov 2026)

All the new work is on branch **`cms-and-vps`**, 8 commits on top of `master`, **NOT pushed**.
`master` = the old Sanity + Vercel version that is still live. Nothing on the server yet.

Done and tested locally on the branch:
1. CMS: Sanity removed. Every word and picture is a JSON file in `sveltekit-project/src/content/`,
   edited with Sveltia CMS at `/admin` (saves to GitHub). "Log in with GitHub" is built into the site
   (`src/routes/api/cms-auth/`). Case studies got readable addresses; old `/case-studies/1..6` redirect.
2. Security: contact form escaped/checked, plain-text email via Brevo, spam trap, 5/hour per visitor,
   10/day total. SvelteKit 3 / Vite 8, `pnpm audit` = 0 known problems.
3. Speed/access: Lighthouse phone 94–98 speed, 100 accessibility/best practices/SEO on every page;
   computer 100 in all four. Old version on the same test: phone speed 72–73, SEO 82, 3.2 MB home page.
4. New page `/about-this-project` with those before/after numbers (written as Kia, "I built…").
5. Content pass: clearly fictional (no real names, email info@kiapmd.dev (Kia's own), dummy address, phone "000 0000 0000 (demo number)"
   — Kia wants it obviously fake), demo note in footer and above the contact form.
6. Server files ready, copied from Aura: `sveltekit-project/Dockerfile`, `compose.server.yml`,
   `deploy-hook.sh`, `deploy/receive-image.sh`, `.github/workflows/deploy.yml`, `.env.example`.

Checks at the last commit: `pnpm check`, `pnpm lint`, `pnpm build` all pass (in `sveltekit-project/`).

## What Kia has judged / not yet

- Approved: CMS switch, all 4 portfolio steps (polish, everything editable, Lighthouse, About page),
  rewriting content as clearly fictional, keeping the name "ABC Company" (not discussed further).
- NOT yet seen by Kia: the site itself in a browser, and the wording of `/about-this-project`
  (it speaks as Kia; Kia should read it and change anything in `/admin`).

## Open question to Kia

"Shall I push the branch to GitHub now?" (asked at the end of the session, not answered: Kia wrapped up).

## Next (in order)

1. Push `cms-and-vps` (outward-facing: ask first). Vercel may build a preview of it; harmless.
2. Server move, following `D:\KIARASH\WORK\servers\kia-netherlands-vps\_server\CLAUDE.md` and its
   docs/server.md "Adding a non-WordPress app". Explain every server step to Kia first. Kia's hands needed:
   - Brevo: SMTP key named "svelte-abc" (into `/srv/svelte-abc/.env`, never chat).
   - GitHub OAuth App for the editor login (callback `https://svelte-abc.kiapmd.dev/api/cms-auth/callback`).
   - Deploy key pair: private half = repo secret `DEPLOY_SSH_KEY`, public half = forced-command line in
     `~claude/.ssh/authorized_keys` (auto mode blocks it: write a script, Kia runs it), plus `DEPLOY_KNOWN_HOSTS`.
   - Server: clone to `/srv/svelte-abc` (public repo, https, branch master), `.env`, line in `repos.conf`,
     Caddy block + the 7-day picture cache in `docs/server.md`; test on `svelte-abc.wp.kiapmd.dev` first.
   - DNS at Porkbun: `svelte-abc` → 85.31.148.209 (today it points to Vercel). Then turn Vercel off.
   - Merge `cms-and-vps` into `master` only when the server is ready (push to master = deploy).
3. After going live: test the real email and the real GitHub login in `/admin`; re-run Lighthouse on
   the live address; add the site to the table in the server project's docs/server.md.

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

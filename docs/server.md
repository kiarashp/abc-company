# ABC Company demo site — how it runs

Per-app notes. Whole-server facts (Caddy, auto-pull, Brevo, traps) are in the server project:
`D:\KIARASH\WORK\servers\kia-netherlands-vps\_server\docs\server.md`.

## What it is

A demo website for a made-up consulting firm ("ABC Company"), built with SvelteKit 3
(a tool for making websites). The site's code is in `sveltekit-project/`.
Address: https://svelte-abc.kiapmd.dev (was on Vercel until the move).

## Content editing (CMS = content editor)

- ALL the site's words and pictures are JSON files (small text data files) in `sveltekit-project/src/content/`:
  - `case-studies/` one file per case study; the file name is its address (`/case-studies/<file name>`).
    Old addresses `/case-studies/1`…`6` redirect to the new ones (`src/hooks.server.ts`).
  - `stories/` the client quotes on the home page.
  - `pages/` the top text of each page plus its browser-tab / Google text.
  - `sections/` every section (services, numbers, FAQ, timeline, team, values, logos, quote, footer...).
  - The code reads them in `sveltekit-project/src/lib/content/index.ts` (with types, so a wrong file fails the check).
  - Until Nov 2026 the stories were in Sanity (an online CMS) and the rest was typed into the code.
- The contact form's service list and the footer's service links follow "Our Expertise".
- Editor: **Sveltia CMS** (free, open source) at `/admin`. Its forms: `sveltekit-project/static/admin/config.yml`.
  The editor's script version is pinned (fixed) in `static/admin/index.html`.
  Uploaded pictures are turned into WebP (a small picture format), max 1600 px, and saved in `static/uploads/`.
- Saving in the editor makes a commit (a saved snapshot) on `master` on GitHub, which starts the normal
  build-and-deploy (below), so the change is live in about 5 minutes.
- "Log in with GitHub" is handled by this site itself (`src/routes/api/cms-auth/`). It needs a GitHub
  OAuth App (GitHub > Settings > Developer settings > OAuth Apps):
  - Homepage URL: `https://svelte-abc.kiapmd.dev`
  - Authorization callback URL: `https://svelte-abc.kiapmd.dev/api/cms-auth/callback`
  - Its client ID and secret go in the server's `.env` (GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET).
- Only GitHub users who can push to `kiarashp/svelte-company` can save. GitHub checks that.

## On the server

Same pattern as Aura (see the server notes, "Adding a non-WordPress app"):

| | |
|---|---|
| Server folder | `/srv/svelte-abc` (git copy of this repo, branch `master`, public repo so no deploy key needed) |
| Box | `svelte-abc-app-1`, image `svelte-abc:live`, limit 160 MB, 0.5 CPU, read-only, healthcheck `/healthz` |
| Caddy | `svelte-abc.kiapmd.dev { import common; reverse_proxy svelte-abc:3000 }` |
| Secrets | `/srv/svelte-abc/.env` (owner claude, 600); names in `.env.example` |
| Email | Brevo, SMTP key "svelte-abc", max 10 contact emails a day (EMAILS_PER_DAY) |
| Database | none |

- Build: GitHub Actions (`.github/workflows/deploy.yml`) checks the code, builds the image, starts it once to
  test it, then sends it over SSH to `deploy/receive-image.sh` on the server. Never built on the server.
- Auto-pull brings only settings files; `deploy-hook.sh` restarts the box when `compose.server.yml` changes.
- Going back: on the server, `/srv/svelte-abc/deploy/receive-image.sh back <commit>`.

## Contact form

`/api/send-mail`. Plain-text email to info@kiapmd.dev with reply-to set to the visitor.
Protections: every field checked, hidden spam-trap field, 5 messages per hour per visitor
(by the X-Forwarded-For address that Caddy sets), 10 a day in total. Both counts are kept in memory and reset
when the box restarts.

## Pages

All pages are prerendered (built into ready HTML at build time). Only `/api/*` and `/healthz` run live.

# Where we are (ABC Company demo site)

Read this first. Current picture only; git history has the story.
How the site runs and is edited: `docs/server.md`.

## What it is

A portfolio demo: website for a FICTIONAL consulting firm, "ABC Company". Kia's own work (built 2025).
Kia (24 Nov 2026): "it will be a portfolio fake website" — rewrite anything that needs it.
New address: **https://abc.kiapmd.dev** (Kia chose it 24 Nov 2026). Old version still live on Vercel at
https://svelte-abc.kiapmd.dev. Repo: github.com/kiarashp/abc-company (public; was svelte-company).
Folder on Kia's PC: `D:\KIARASH\WORK\servers\kia-netherlands-vps\abc-company` (was `to-polish\svelte-company`).

## State (24 Nov 2026)

All the new work is on branch **`cms-and-vps`**, pushed to GitHub, not merged. `master` = the old
Sanity + Vercel version. Nothing on the server yet.

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

1. **Kia:** DNS at Porkbun: A record `abc` → 85.31.148.209. Brevo: new SMTP key "abc" (value goes into
   `/srv/abc/.env` through a file, never the chat). GitHub OAuth App: homepage `https://abc.kiapmd.dev`,
   callback `https://abc.kiapmd.dev/api/cms-auth/callback`.
2. Server (follow the server's docs/server.md "Adding a non-WordPress app"; explain each step to Kia first):
   clone to `/srv/abc` (public repo, https, branch master), `.env`, line in `repos.conf`, Caddy block +
   7-day picture cache; deploy key pair (private = repo secret `DEPLOY_SSH_KEY`, public = forced-command line
   in `~claude/.ssh/authorized_keys`: auto mode blocks it, Kia runs a script), `DEPLOY_KNOWN_HOSTS`.
3. Merge `cms-and-vps` into `master` when the server is ready (push to master = build and deploy).
4. Old address: Kia points `svelte-abc` at the server too, Caddy forwards it to abc.kiapmd.dev; then turn
   the Vercel project off.
5. After going live: test real email + GitHub login in `/admin`; re-run Lighthouse live; update the
   server's docs/server.md table (row already added, "being set up").
   Also the portfolio card in kiapmd-dev (`src/content/projects/abc.md`: github + demo links still old).

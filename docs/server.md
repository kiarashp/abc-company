# ABC Company demo site — how it runs

Per-app notes. Whole-server facts (Caddy, auto-pull, Brevo, traps) are in the server project:
`D:\KIARASH\WORK\servers\kia-netherlands-vps\_server\docs\server.md`.

## What it is

A demo website for a made-up consulting firm ("ABC Company"), built with SvelteKit 3
(a tool for making websites). The site's code is in `sveltekit-project/`.
Address: https://abc.kiapmd.dev. Until Nov 2026 it was on Vercel at svelte-abc.kiapmd.dev (that old address
should forward to the new one; see the server's Caddyfile). Repo: github.com/kiarashp/abc-company (public;
renamed from svelte-company on 24 Nov 2026, GitHub forwards the old name). On Kia's PC:
`D:\KIARASH\WORK\servers\kia-netherlands-vps\abc-company` (moved from `to-polish\svelte-company`).

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
- "Log in with GitHub" is handled by this site itself (`src/routes/api/cms-auth/`). It uses a **GitHub App**
  named "ABC Company editor" (GitHub > Settings > Developer settings > GitHub Apps), made 24 Nov 2026:
  - Homepage `https://abc.kiapmd.dev`, redirect URI `https://abc.kiapmd.dev/api/cms-auth/callback`.
  - Only permission: Repository > Contents: Read and write. No webhook, user tokens do not expire,
    installable only on Kia's account, **installed only on abc-company**.
  - Its Client ID (starts with "Iv") and a client secret are in the server's `.env` (GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET). No private key is needed.
- Why a GitHub App and NOT an OAuth App (Kia, 24 Nov 2026): an OAuth App's login key can change ALL the
  user's public repos (and with a private repo, ALL repos). A GitHub App's key reaches only the repos it is
  installed on. Use a GitHub App for every Git-based CMS login, also for clients.
- Only GitHub users who can push to `kiarashp/abc-company` can save. GitHub checks that.
- To cut off all editor access at once: uninstall the app, or make a new client secret.

## If it breaks, only it goes down

- Its own box with hard limits (memory, CPU, processes), so a leak or a loop can't starve the other sites.
- No database and no shared files: it uses nothing the other sites use, except Caddy (the front door) and Brevo.
- If the box is down, Caddy shows an error for abc.kiapmd.dev only; every other address keeps working.
- A broken build never arrives: GitHub tests the image first, and the server only switches to a new image
  when it says "healthy" (otherwise the log says NOT HEALTHY and `receive-image.sh back <commit>` goes back).
- Email: its own Brevo key (switch it off alone) and its own 20-a-day cap, saved across restarts.

## On the server

Same pattern as Aura (see the server notes, "Adding a non-WordPress app"):

| | |
|---|---|
| Server folder | `/srv/abc` (git copy of this repo, branch `master`, public repo so no deploy key needed) |
| Box | `abc-app-1`, image `abc:live`, limit 160 MB (no swap), 0.5 CPU, 100 processes, read-only, no extra rights, first to be stopped if the server runs out of memory, healthcheck `/healthz` |
| Volume | `abc_email-count` at `/data`: only the day's email count (not worth backing up) |
| Caddy | `abc.kiapmd.dev { import common; reverse_proxy abc:3000 }` plus a 7-day browser cache for pictures (see below) |
| Secrets | `/srv/abc/.env` (owner claude, 600); names in `.env.example` |
| Email | Brevo, SMTP key "abc", max 20 contact emails a day (EMAILS_PER_DAY, default 20; Kia, 24 Nov 2026), from abc@kiapmd.dev |
| Database | none |

- Build: GitHub Actions (`.github/workflows/deploy.yml`) checks the code, builds the image, starts it once to
  test it, then sends it over SSH to `deploy/receive-image.sh` on the server. Never built on the server.
- Auto-pull brings only settings files; `deploy-hook.sh` restarts the box when `compose.server.yml` changes.
- Going back: on the server, `/srv/abc/deploy/receive-image.sh back <commit>`.

## Speed (Lighthouse, Nov 2026, before the move)

Phone: speed 94–98, accessibility / best practices / SEO 100 on every page. Computer: 100 in all four.
Before the Nov 2026 rework (same test, same computer): phone speed 72–73, accessibility 89–94, SEO 82,
main content after 10.6–15.6 s, home page 3.2 MB. These numbers are on the page /about-this-project (editable).
The one tip left is for Caddy: let browsers keep pictures (they have no version in their name, so 7 days, not forever):

```
@pictures path *.webp *.svg *.png *.jpg *.ico
header @pictures Cache-Control "public, max-age=604800"
```

Files under `/_app/immutable/` already get "keep forever" from the app (their names change when they change).

## Contact form

`/api/send-mail`. Plain-text email to info@kiapmd.dev with reply-to set to the visitor.
Protections: every field checked, hidden spam-trap field, 5 messages per hour per visitor
(by the X-Forwarded-For address that Caddy sets; kept in memory), 20 a day in total. The daily count is saved
in `/data/email-count.json` on a volume, so a crash-and-restart loop cannot reset it.

## Pages

All pages are prerendered (built into ready HTML at build time). Only `/api/*` and `/healthz` run live.

## Security check (24 Nov 2026, on the live site)

Tested from the server with harmless fake attacks; all blocked:
- Form posted from another website (text/plain or form data): 403 (SvelteKit's origin check).
- Oversized or broken form data: 400. Spam-trap field filled: answers "sent", sends nothing, count unchanged.
- Extra email headers via line breaks: refused (fields checked, subject made one line, email is plain text,
  and it only ever goes to info@kiapmd.dev, so the form can't be used to spam others).
- Fake host header on the login link: GitHub return address stays abc.kiapmd.dev (Caddy overwrites it).
- Login return with a made-up code: "Login failed" (the one-time `state` cookie must match).
- `/.env`, `/.git/config`, `../` tricks: 404. Secrets are only in the box's environment, never in files it serves.
- Box: runs as user `node`, can't write its own files, no Docker access, hard limits.
- No raw HTML output anywhere in the site code (`{@html}`), `pnpm audit`: no known problems.
Added then: Caddy headers for abc.kiapmd.dev (no framing by other sites, HSTS), and a fingerprint (SRI) on
the editor script in `static/admin/index.html`. **Updating Sveltia = update the version AND the fingerprint**
(command in that file), or /admin stays blank.

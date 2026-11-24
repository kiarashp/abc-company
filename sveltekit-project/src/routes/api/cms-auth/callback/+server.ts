// Step 2 of "log in with GitHub" for the content editor (step 1 is ../+server.ts).
// GitHub sends the visitor back here with a one-time code. We swap it for a login token
// (this needs our secret, which never leaves the server), then hand the token to the editor
// window that opened this pop-up, and only if that window is on our own site.
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$app/env/private';
import type { RequestHandler } from './$types';

export const prerender = false;

// JSON that is safe to put inside a <script> tag ("<" is written as the code u003c, so text cannot close the tag).
const safeJson = (value: string) => JSON.stringify(value).replace(/</g, '\\u003c');

// The small page shown in the pop-up. It talks to the editor window using the message
// format Decap / Sveltia CMS expect ("authorizing:github", then "authorization:github:...").
function page(origin: string, status: 'success' | 'error', content: object): Response {
	const message = `authorization:github:${status}:${JSON.stringify(content)}`;
	const html = `<!doctype html><html><head><meta charset="utf-8"><title>Logging in…</title></head><body>
<p>${status === 'success' ? 'Logged in. This window will close.' : 'Login failed. You can close this window.'}</p>
<script>
(function () {
	var origin = ${safeJson(origin)};
	var message = ${safeJson(message)};
	window.addEventListener('message', function (e) {
		if (e.origin !== origin) return; // only our own site gets the token
		window.opener.postMessage(message, origin);
	}, { once: true });
	if (window.opener) window.opener.postMessage('authorizing:github', origin);
})();
</script></body></html>`;
	return new Response(html, {
		headers: {
			'content-type': 'text/html; charset=utf-8',
			'cache-control': 'no-store',
			'referrer-policy': 'no-referrer'
		}
	});
}

export const GET: RequestHandler = async ({ url, cookies }) => {
	const origin = url.origin;
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const expected = cookies.get('cms_auth_state');
	cookies.delete('cms_auth_state', { path: '/api/cms-auth' });

	if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
		return page(origin, 'error', { message: 'Editor login is not set up on this server.' });
	}
	if (!code || !state || !expected || state !== expected) {
		return page(origin, 'error', {
			message: 'The login link is old or invalid. Please try again.'
		});
	}

	try {
		const res = await fetch('https://github.com/login/oauth/access_token', {
			method: 'POST',
			headers: { accept: 'application/json', 'content-type': 'application/json' },
			body: JSON.stringify({
				client_id: GITHUB_CLIENT_ID,
				client_secret: GITHUB_CLIENT_SECRET,
				code,
				redirect_uri: `${origin}/api/cms-auth/callback`
			})
		});
		const data = (await res.json()) as { access_token?: string; error?: string };
		if (!data.access_token) {
			console.error('cms-auth: GitHub refused the code:', data.error);
			return page(origin, 'error', { message: 'GitHub refused the login. Please try again.' });
		}
		return page(origin, 'success', { token: data.access_token, provider: 'github' });
	} catch (e) {
		console.error('cms-auth: could not reach GitHub:', e instanceof Error ? e.message : e);
		return page(origin, 'error', { message: 'Could not reach GitHub. Please try again.' });
	}
};

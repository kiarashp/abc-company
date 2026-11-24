// Step 1 of "log in with GitHub" for the content editor at /admin.
// The editor opens this address in a small pop-up window. We send the visitor to GitHub,
// which asks "let this app edit your repos?" and then comes back to ./callback.
//
// Only people who can already push to the GitHub repo can save anything: GitHub checks that,
// not us. This code only hands the editor a GitHub login token.
import { GITHUB_CLIENT_ID } from '$app/env/private';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = false;

export const GET: RequestHandler = ({ url, cookies }) => {
	if (!GITHUB_CLIENT_ID)
		error(503, 'Editor login is not set up on this server (GITHUB_CLIENT_ID).');

	// A random value we check again when GitHub sends the visitor back, so nobody can
	// trick a browser into finishing a login it never started.
	const state = crypto.randomUUID();
	cookies.set('cms_auth_state', state, {
		path: '/api/cms-auth',
		httpOnly: true,
		secure: url.protocol === 'https:',
		sameSite: 'lax',
		maxAge: 600
	});

	const github = new URL('https://github.com/login/oauth/authorize');
	github.searchParams.set('client_id', GITHUB_CLIENT_ID);
	github.searchParams.set('redirect_uri', `${url.origin}/api/cms-auth/callback`);
	// No "scope": this is a GitHub App, so the login can only reach the repos the app is installed on
	// (only abc-company), with only the rights the app has (Contents: read and write).
	github.searchParams.set('state', state);
	// A plain redirect response: SvelteKit's redirect() helper refuses outside sites on purpose,
	// and this one hop to github.com is intended.
	return new Response(null, { status: 302, headers: { location: github.toString() } });
};

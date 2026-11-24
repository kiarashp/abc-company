// The settings this app reads from its environment (values given to the app when it starts,
// kept out of the code). On the server they live in /srv/svelte-abc/.env, never in git.
// Every one is optional: without them the site still works, only email / editor login are off.
import { defineEnvVars } from '@sveltejs/kit/env';

const optional = (value: string | undefined) => value || undefined;

export const variables = defineEnvVars({
	// Email through Brevo (an email-sending service; Kia's shared account, SMTP key named "svelte-abc").
	// SMTP is the standard way programs hand email to a mail service.
	SMTP_LOGIN: { description: 'Brevo SMTP login.', schema: optional },
	SMTP_KEY: { description: 'Brevo SMTP key (a password just for this app).', schema: optional },
	SMTP_HOST: { description: 'Default: smtp-relay.brevo.com', schema: optional },
	SMTP_PORT: { description: 'Default: 587', schema: optional },
	MAIL_FROM: {
		description: 'Sender; must be on a domain set up in Brevo. Default: ABC Company demo <svelte-abc@kiapmd.dev>',
		schema: optional
	},
	CONTACT_TO_EMAIL: { description: 'Where contact form messages go. Default: info@kiapmd.dev', schema: optional },
	EMAILS_PER_DAY: { description: 'Most contact emails per day (Brevo is shared). Default: 10', schema: optional },

	// "Log in with GitHub" for the content editor at /admin. Both come from a GitHub OAuth App
	// (GitHub > Settings > Developer settings > OAuth Apps).
	GITHUB_CLIENT_ID: { description: 'GitHub OAuth App client ID.', schema: optional },
	GITHUB_CLIENT_SECRET: { description: 'GitHub OAuth App client secret.', schema: optional }
});

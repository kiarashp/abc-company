// The settings this app reads from its environment (values given to the app when it starts,
// kept out of the code). On the server they live in /srv/abc/.env, never in git.
// Every one is optional: without them the site still works, only email / editor login are off.
import { defineEnvVars } from '@sveltejs/kit/env';

const optional = (value: string | undefined) => value || undefined;

export const variables = defineEnvVars({
	// Email through Brevo (an email-sending service; Kia's shared account, SMTP key named "abc").
	// SMTP is the standard way programs hand email to a mail service.
	SMTP_LOGIN: { description: 'Brevo SMTP login.', schema: optional },
	SMTP_KEY: { description: 'Brevo SMTP key (a password just for this app).', schema: optional },
	SMTP_HOST: { description: 'Default: smtp-relay.brevo.com', schema: optional },
	SMTP_PORT: { description: 'Default: 587', schema: optional },
	MAIL_FROM: {
		description:
			'Sender; must be on a domain set up in Brevo. Default: ABC Company demo <abc@kiapmd.dev>',
		schema: optional
	},
	CONTACT_TO_EMAIL: {
		description: 'Where contact form messages go. Default: info@kiapmd.dev',
		schema: optional
	},
	EMAILS_PER_DAY: {
		description: 'Most contact emails per day (Brevo is shared). Default: 20',
		schema: optional
	},

	// "Log in with GitHub" for the content editor at /admin. Both come from a GitHub App installed only
	// on this repo (GitHub > Settings > Developer settings > GitHub Apps), so a login can't reach other repos.
	GITHUB_CLIENT_ID: { description: 'GitHub App client ID (starts with Iv).', schema: optional },
	GITHUB_CLIENT_SECRET: { description: 'GitHub App client secret.', schema: optional }
});

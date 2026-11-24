// The settings this app reads from its environment (values given to the app when it starts,
// kept out of the code). On the server they live in a private .env file, never in git.
import { defineEnvVars } from '@sveltejs/kit/env';

const optional = (value: string | undefined) => value || undefined;

export const variables = defineEnvVars({
	SENDGRID_API_KEY: {
		description: 'Secret key for SendGrid (the email-sending service) used by the contact form.',
		schema: optional
	},
	CONTACT_TO_EMAIL: {
		description: 'Where contact form messages are sent. Default: info@kiapmd.dev',
		schema: optional
	},
	CONTACT_FROM_EMAIL: {
		description: 'The sender address on those emails (must be verified in SendGrid). Default: form@kiapmd.dev',
		schema: optional
	}
});

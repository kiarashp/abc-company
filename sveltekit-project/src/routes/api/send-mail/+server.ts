// Receives the "Contact Us" form and emails it to us through SendGrid (an email-sending service).
//
// Safety rules here, because anyone on the internet can call this address:
// - Every field is checked (required, max length, email shape, known service).
// - Everything the visitor typed is "escaped" before it goes into the email,
//   so they can't slip their own HTML (web page code, e.g. fake links) into it.
// - A hidden "website" field catches simple spam bots (people never see or fill it).
// - Each visitor (by IP address) can send only a few messages per hour.
// - Errors are logged on the server, never sent back to the visitor.

import { SENDGRID_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } from '$app/env/private';
import sgmail from '@sendgrid/mail';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const SERVICES = new Set([
	'product-consulting',
	'legacy-system-migration',
	'automated-teams',
	'engineering-consulting',
	'erp-implementation',
	'cybersecurity-services'
]);

const LIMITS = { name: 100, email: 200, subject: 200, budget: 15, message: 5000 };
const EMAIL_SHAPE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

// Rate limit (a cap on how often one visitor can send). Kept in memory:
// fine for one small server; it resets when the app restarts.
const MAX_PER_HOUR = 5;
const HOUR = 60 * 60 * 1000;
const sends = new Map<string, number[]>();

function tooMany(ip: string): boolean {
	const now = Date.now();
	const recent = (sends.get(ip) ?? []).filter((t) => now - t < HOUR);
	if (recent.length >= MAX_PER_HOUR) {
		sends.set(ip, recent);
		return true;
	}
	recent.push(now);
	sends.set(ip, recent);
	// Keep the list from growing forever.
	if (sends.size > 10_000) sends.clear();
	return false;
}

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function text(value: unknown, max: number): string | null {
	if (typeof value !== 'string') return null;
	const trimmed = value.trim();
	if (trimmed.length === 0 || trimmed.length > max) return null;
	return trimmed;
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request' }, { status: 400 });
	}

	// Spam bot filled the hidden field: pretend it worked, send nothing.
	if (typeof body.website === 'string' && body.website.length > 0) {
		return json({ emailSentSuccessfully: true });
	}

	const name = text(body.contactName, LIMITS.name);
	const email = text(body.contactEmail, LIMITS.email);
	const service = text(body.contactService, 50);
	const budget = text(String(body.contactBudget ?? ''), LIMITS.budget);
	const subject = text(body.contactSubject, LIMITS.subject);
	const message = text(body.contactMessage, LIMITS.message);

	if (
		!name ||
		!email ||
		!EMAIL_SHAPE.test(email) ||
		!service ||
		!SERVICES.has(service) ||
		!budget ||
		!/^\d+(\.\d{1,2})?$/.test(budget) ||
		!subject ||
		!message
	) {
		return json({ error: 'Please fill in every field correctly.' }, { status: 400 });
	}

	if (tooMany(getClientAddress())) {
		return json({ error: 'Too many messages. Please try again later.' }, { status: 429 });
	}

	const apiKey = SENDGRID_API_KEY;
	if (!apiKey) {
		console.error('send-mail: SENDGRID_API_KEY is not set');
		return json({ error: 'Email is not available right now.' }, { status: 500 });
	}
	sgmail.setApiKey(apiKey);

	const safe = {
		name: escapeHtml(name),
		email: escapeHtml(email),
		service: escapeHtml(service),
		budget: escapeHtml(budget),
		subject: escapeHtml(subject),
		message: escapeHtml(message).replace(/\n/g, '<br>')
	};

	try {
		await sgmail.send({
			to: CONTACT_TO_EMAIL || 'info@kiapmd.dev',
			from: CONTACT_FROM_EMAIL || 'form@kiapmd.dev',
			// Pressing "reply" in the inbox answers the visitor directly.
			replyTo: email,
			subject: 'New Contact Us Form Submission from ABC Company',
			text:
				`Somebody used the contact form on the ABC Company website.\n\n` +
				`Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nBudget: ${budget}\n` +
				`Service: ${service}\n\nMessage:\n${message}\n`,
			html: `<p>Somebody used the contact form on the ABC Company website. Here are the details:</p>
				<p><strong>Name:</strong> ${safe.name}</p>
				<p><strong>Email:</strong> ${safe.email}</p>
				<p><strong>Subject:</strong> ${safe.subject}</p>
				<p><strong>Budget:</strong> ${safe.budget}</p>
				<p><strong>Service:</strong> ${safe.service}</p>
				<p><strong>Message:</strong><br>${safe.message}</p>`
		});
		return json({ emailSentSuccessfully: true });
	} catch (error) {
		console.error('send-mail: SendGrid failed', error);
		return json({ error: 'The message could not be sent.' }, { status: 502 });
	}
};

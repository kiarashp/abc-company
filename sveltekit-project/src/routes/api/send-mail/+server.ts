// Receives the "Contact Us" form and emails it to us through Brevo (see #lib/server/mail.ts).
//
// Safety rules here, because anyone on the internet can call this address:
// - Every field is checked (required, max length, email shape, known service).
// - The email is plain text only, so nothing a visitor types can turn into
//   web page code (like fake links) inside it.
// - A hidden "website" field catches simple spam bots (people never see or fill it).
// - Each visitor (by IP address) can send only a few messages per hour,
//   and the whole site only EMAILS_PER_DAY a day.
// - Errors are logged on the server, never sent back to the visitor.

import { CONTACT_TO_EMAIL } from '$app/env/private';
import { json } from '@sveltejs/kit';
import { sendMail } from '#lib/server/mail.ts';
import type { RequestHandler } from './$types';

// This address must run live on the server, never be built ahead of time.
export const prerender = false;

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

function text(value: unknown, max: number): string | null {
	if (typeof value !== 'string') return null;
	const trimmed = value.trim();
	if (trimmed.length === 0 || trimmed.length > max) return null;
	return trimmed;
}

// One line only: stops a visitor from adding extra lines to the email's subject.
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ');

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

	const result = await sendMail({
		to: CONTACT_TO_EMAIL || 'info@kiapmd.dev',
		// Pressing "reply" in the inbox answers the visitor directly.
		replyTo: email,
		subject: `ABC Company demo contact form: ${oneLine(subject).slice(0, 120)}`,
		text:
			`Somebody used the contact form on the ABC Company demo site.\n\n` +
			`Name: ${oneLine(name)}\nEmail: ${email}\nSubject: ${oneLine(subject)}\n` +
			`Budget: ${budget}\nService: ${service}\n\nMessage:\n${message}\n`
	});

	if (result === 'sent') return json({ emailSentSuccessfully: true });
	if (result === 'capped') {
		return json({ error: 'Too many messages today. Please try again tomorrow.' }, { status: 429 });
	}
	return json({ error: 'The message could not be sent.' }, { status: 502 });
};

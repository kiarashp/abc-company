// Email through Brevo (SMTP: the standard way programs hand email to a mail service).
// The Brevo account is shared with Kia's other sites (300 a day for all together),
// so this app sends at most EMAILS_PER_DAY (default 20) per day (UTC).
// The count is saved in a small file (COUNT_FILE) on a Docker volume (a storage folder that
// outlives the box), so a crash-and-restart loop cannot reset it and send more.
// Without that folder (on a laptop) the count is kept in memory only.
import { readFileSync, writeFileSync } from 'node:fs';
import nodemailer from 'nodemailer';
import {
	SMTP_LOGIN,
	SMTP_KEY,
	SMTP_HOST,
	SMTP_PORT,
	MAIL_FROM,
	EMAILS_PER_DAY
} from '$app/env/private';

const COUNT_FILE = '/data/email-count.json';
const today = () => new Date().toISOString().slice(0, 10);

let day = '';
let sentToday = 0;
try {
	const saved = JSON.parse(readFileSync(COUNT_FILE, 'utf8'));
	if (typeof saved.day === 'string' && Number.isInteger(saved.sent)) {
		day = saved.day;
		sentToday = saved.sent;
	}
} catch {
	// No file yet, or no /data folder: start at 0.
}

function save() {
	try {
		writeFileSync(COUNT_FILE, JSON.stringify({ day, sent: sentToday }));
	} catch {
		// No /data folder (on a laptop): memory only.
	}
}

function reserve(): boolean {
	if (today() !== day) {
		day = today();
		sentToday = 0;
	}
	if (sentToday >= Number(EMAILS_PER_DAY || 20)) return false;
	sentToday++;
	save();
	return true;
}

interface Mail {
	to: string;
	subject: string;
	text: string;
	replyTo?: string;
}

// Returns 'sent', 'capped' (daily limit reached), 'off' (no SMTP settings) or 'failed'.
export async function sendMail(mail: Mail): Promise<'sent' | 'capped' | 'off' | 'failed'> {
	if (!SMTP_LOGIN || !SMTP_KEY) {
		console.warn('Email not sent: SMTP_LOGIN / SMTP_KEY not set');
		return 'off';
	}
	if (!reserve()) {
		console.warn('Email not sent: daily cap reached');
		return 'capped';
	}
	try {
		const transport = nodemailer.createTransport({
			host: SMTP_HOST || 'smtp-relay.brevo.com',
			port: Number(SMTP_PORT || 587),
			secure: false,
			requireTLS: true,
			auth: { user: SMTP_LOGIN, pass: SMTP_KEY },
			connectionTimeout: 15_000,
			socketTimeout: 20_000
		});
		await transport.sendMail({
			from: MAIL_FROM || 'ABC Company demo <abc@kiapmd.dev>',
			...mail
		});
		return 'sent';
	} catch (e) {
		// Give the slot back: nothing was sent.
		sentToday--;
		save();
		console.error('Email failed:', e instanceof Error ? e.message : e);
		return 'failed';
	}
}

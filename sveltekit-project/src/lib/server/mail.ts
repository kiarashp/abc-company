// Email through Brevo (SMTP: the standard way programs hand email to a mail service).
// The Brevo account is shared with Kia's other sites (300 a day for all together),
// so this app sends at most EMAILS_PER_DAY (default 10) per day (UTC).
// The count is kept in memory: it starts again at 0 if the app restarts. Fine for a demo site.
import nodemailer from 'nodemailer';
import {
	SMTP_LOGIN,
	SMTP_KEY,
	SMTP_HOST,
	SMTP_PORT,
	MAIL_FROM,
	EMAILS_PER_DAY
} from '$app/env/private';

let day = '';
let sentToday = 0;

function reserve(): boolean {
	const today = new Date().toISOString().slice(0, 10);
	if (today !== day) {
		day = today;
		sentToday = 0;
	}
	if (sentToday >= Number(EMAILS_PER_DAY || 10)) return false;
	sentToday++;
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
			from: MAIL_FROM || 'ABC Company demo <svelte-abc@kiapmd.dev>',
			...mail
		});
		return 'sent';
	} catch (e) {
		// Give the slot back: nothing was sent.
		sentToday--;
		console.error('Email failed:', e instanceof Error ? e.message : e);
		return 'failed';
	}
}

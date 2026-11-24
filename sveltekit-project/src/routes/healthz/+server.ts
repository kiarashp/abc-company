// A tiny "are you alive?" address for Docker's health check (see compose.server.yml).
import { text } from '@sveltejs/kit';

export const prerender = false;

export function GET() {
	return text('ok');
}

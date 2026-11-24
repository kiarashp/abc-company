// Runs on the server before every live request (pages built ahead of time are served directly).
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';
import { caseStudies } from '#lib/content/index.ts';

// Case studies used to live at /case-studies/1 … /case-studies/6 (Nov 2026 they got
// readable addresses). Old links get a permanent redirect (301) to the new address.
const OLD_CASE_STUDY = /^\/case-studies\/([1-9])\/?$/;

export const handle: Handle = async ({ event, resolve }) => {
	const old = OLD_CASE_STUDY.exec(event.url.pathname);
	if (old) {
		const study = caseStudies[Number(old[1]) - 1];
		if (study) redirect(301, `/case-studies/${study.slug}`);
	}
	return resolve(event);
};

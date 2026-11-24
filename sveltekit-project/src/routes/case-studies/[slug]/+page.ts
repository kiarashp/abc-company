import { error } from '@sveltejs/kit';
import type { PageLoad, EntryGenerator } from './$types';
import caseStudies from '#lib/db/caseStudies.ts';

// Each case study's address is its slug, e.g. /case-studies/1.
// Only exact matches open a page; anything else (like "1abc" or "99") is "Not found".
export const load: PageLoad = ({ params }) => {
	const SingleCase = caseStudies.find((c) => c.slug === `/${params.slug}`);
	if (!SingleCase) error(404, 'Not found');

	// "Related Cases": two others, never the one being read.
	const related = caseStudies.filter((c) => c !== SingleCase).slice(0, 2);
	return { SingleCase, related };
};

// Tells the build which case-study pages exist, so each is made ahead of time.
export const entries: EntryGenerator = () =>
	caseStudies.map((c) => ({ slug: c.slug.replace(/^\//, '') }));

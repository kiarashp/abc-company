import { error } from '@sveltejs/kit';
import type { PageLoad, EntryGenerator } from './$types';
import { caseStudies } from '#lib/content/index.ts';

// Each case study's address is its file name in src/content/case-studies,
// e.g. /case-studies/real-time-global-supply-chain-visibility.
export const load: PageLoad = ({ params }) => {
	const SingleCase = caseStudies.find((c) => c.slug === params.slug);
	if (!SingleCase) error(404, 'Not found');

	// "Related Cases": two others, never the one being read.
	const related = caseStudies.filter((c) => c !== SingleCase).slice(0, 2);
	return { SingleCase, related };
};

// Tells the build which case-study pages exist, so each is made ahead of time.
export const entries: EntryGenerator = () => caseStudies.map((c) => ({ slug: c.slug }));

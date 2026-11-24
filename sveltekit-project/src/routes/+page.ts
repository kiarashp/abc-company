import { stories } from '#lib/content/stories.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	return { stories };
};

// Reads the "Success Stories" from the JSON files in src/content/stories.
// Those files are edited through the CMS (content editor) at /admin,
// which saves each change as a commit (a saved snapshot) in GitHub.
// The files are bundled in when the site is built, so no database is needed.

export type SuccessStory = {
	title: string;
	desc: string;
	writer: string;
	// Lower numbers show first on the home page.
	order?: number;
};

const files = import.meta.glob<SuccessStory>('/src/content/stories/*.json', {
	eager: true,
	import: 'default'
});

export const stories: SuccessStory[] = Object.values(files).sort(
	(a, b) => (a.order ?? 999) - (b.order ?? 999)
);

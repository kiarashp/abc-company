// All the site's words and pictures, read from the JSON files in src/content.
// Those files are edited through the CMS (content editor) at /admin; each save is a
// commit in GitHub, which rebuilds the site. The files are bundled in at build time,
// so the site needs no database. The editor's form for each file is in static/admin/config.yml.

export type Card = { title: string; text: string; image: string };
export type Section<Item = Card> = { title: string; subtitle: string; items: Item[] };

export type Page = {
	seoTitle: string;
	seoDescription: string;
	title: string;
	subtitle: string;
	description: string;
};

export type CaseStudy = {
	slug: string; // from the file name; it is also the page address: /case-studies/<slug>
	title: string;
	image: string;
	shortChallenge: string;
	shortSolution: string;
	challenge: string;
	solution: string;
	order?: number;
};

export type Story = { title: string; desc: string; writer: string; order?: number };

type Sections = {
	expertise: Section;
	impact: Section<{ value: string; label: string }> & {
		highlight: { value: string; label: string };
	};
	'why-us': Section;
	faq: Section<{ question: string; answer: string }>;
	timeline: Section<{ year: string; title: string; text: string }>;
	values: Section;
	team: Section<{ name: string; role: string; photo: string }>;
	'join-us': Section;
	'get-in-touch': Section;
	clients: { title: string; items: { name: string; logo: string }[] };
	stories: { title: string; subtitle: string };
	'case-studies': { title: string; subtitle: string };
	quote: { text: string; name: string; role: string };
	footer: { about: string; companyName: string };
};

type PageName = 'home' | 'about-us' | 'case-studies' | 'services' | 'contact-us';

// "Folder name → file name without .json → its data".
function byName<T>(files: Record<string, unknown>): Record<string, T> {
	return Object.fromEntries(
		Object.entries(files).map(([file, data]) => [
			file
				.split('/')
				.pop()!
				.replace(/\.json$/, ''),
			data as T
		])
	);
}

const byOrder = (a: { order?: number }, b: { order?: number }) =>
	(a.order ?? 999) - (b.order ?? 999);

const sectionFiles = byName<unknown>(
	import.meta.glob('/src/content/sections/*.json', { eager: true, import: 'default' })
);
const pageFiles = byName<Page>(
	import.meta.glob('/src/content/pages/*.json', { eager: true, import: 'default' })
);

export function section<K extends keyof Sections>(name: K): Sections[K] {
	const data = sectionFiles[name];
	if (!data) throw new Error(`Missing content file: src/content/sections/${name}.json`);
	return data as Sections[K];
}

export function page(name: PageName): Page {
	const data = pageFiles[name];
	if (!data) throw new Error(`Missing content file: src/content/pages/${name}.json`);
	return data;
}

export const caseStudies: CaseStudy[] = Object.entries(
	byName<Omit<CaseStudy, 'slug'>>(
		import.meta.glob('/src/content/case-studies/*.json', { eager: true, import: 'default' })
	)
)
	.map(([slug, data]) => ({ ...data, slug }))
	.sort(byOrder);

export const stories: Story[] = Object.values(
	byName<Story>(import.meta.glob('/src/content/stories/*.json', { eager: true, import: 'default' }))
).sort(byOrder);

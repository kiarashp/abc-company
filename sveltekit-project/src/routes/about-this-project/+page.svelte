<script lang="ts">
	import Header from '#components/Header.svelte';
	import { projectPage } from '#lib/content/index.ts';
	import { reveal } from '#lib/actions/reveal.ts';

	const p = projectPage();
</script>

<svelte:head>
	<title>{p.seoTitle}</title>
	<meta name="description" content={p.seoDescription} />
</svelte:head>

<div
	class="paddingContainer relative flex flex-col bg-[url('/decorative/shady-circle.webp')] bg-contain bg-top bg-no-repeat pb-[30px]"
>
	<Header />
	<h1 class="heading-xxl mt-[105px] w-12/12 xl:w-10/12">{p.title}</h1>
	<p class="body-lg mt-[24px] w-12/12 xl:w-8/12">{p.intro}</p>
</div>

<!-- Before and after -->
<section class="paddingContainer mt-[60px] flex flex-col xl:mt-[96px]">
	<h2 class="heading-xl">{p.resultsTitle}</h2>
	<p class="body-lg mt-2 w-12/12 xl:w-9/12">{p.resultsIntro}</p>
	<div class="mt-[45px] grid grid-cols-12 gap-4 xl:gap-[30px]">
		{#each p.results as result, i (result.label)}
			<div
				use:reveal={(i % 3) * 110}
				class="col-span-12 flex flex-col justify-between gap-4 rounded-lg border border-[rgba(81,113,147,0.25)] bg-white/70 p-6 md:col-span-6 xl:col-span-4"
			>
				<p class="body-lg text-accent">{result.label}</p>
				<p class="flex items-baseline gap-3">
					<span class="heading-md text-accent line-through decoration-1">{result.before}</span>
					<span class="text-accent" aria-hidden="true">→</span>
					<span class="sr-only">now</span>
					<span class="heading-xl text-secondary-ink font-bold">{result.after}</span>
				</p>
			</div>
		{/each}
	</div>
	<p class="body-md text-accent mt-[24px] w-12/12 xl:w-9/12">{p.resultsNote}</p>
</section>

<!-- What is inside -->
<section class="paddingContainer mt-[60px] flex flex-col xl:mt-[96px]">
	<h2 class="heading-xl">{p.featuresTitle}</h2>
	<div class="mt-[45px] grid grid-cols-12 gap-x-4 gap-y-8 xl:gap-[30px]">
		{#each p.features as feature, i (feature.title)}
			<div
				use:reveal={(i % 3) * 110}
				class="col-span-12 flex flex-col gap-[11px] md:col-span-6 xl:col-span-4"
			>
				<h3 class="heading-md text-secondary-ink">{feature.title}</h3>
				<p class="body-lg text-accent">{feature.text}</p>
			</div>
		{/each}
	</div>
</section>

<!-- Tools and links -->
<section class="paddingContainer mt-[60px] flex flex-col xl:mt-[96px]">
	<h2 class="heading-xl">{p.toolsTitle}</h2>
	<ul class="mt-[30px] flex flex-wrap gap-3">
		{#each p.tools as tool (tool)}
			<li
				class="body-md text-primary rounded-full border border-[rgba(81,113,147,0.35)] bg-white/70 px-4 py-2"
			>
				{tool}
			</li>
		{/each}
	</ul>
	<div class="mt-[45px] flex flex-col gap-4 md:flex-row md:gap-8">
		{#each p.links as link (link.url)}
			<a
				class="body-lg text-secondary-ink hover:text-primary inline-block py-2 font-semibold underline duration-300"
				href={link.url}
				rel="noopener">{link.label} →</a
			>
		{/each}
	</div>
</section>

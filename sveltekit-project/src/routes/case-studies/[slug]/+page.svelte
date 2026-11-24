<script lang="ts">
	import Header from '#components/Header.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Long texts can have several paragraphs (an empty line between them in the editor).
	const paragraphs = (text: string) => text.split(/\n\s*\n/).filter((p) => p.trim());
</script>

<svelte:head>
	<title>{data.SingleCase.title} — ABC Company</title>
	<meta name="description" content={data.SingleCase.shortChallenge} />
</svelte:head>

<div class="paddingContainer flex min-h-screen flex-col justify-start bg-[#F5F5F5] pb-[30px]">
	<Header />
	<div class="mt-[105px] grid grid-cols-10 gap-4 xl:gap-[30px]">
		<div class=" col-span-10 md:col-span-7">
			<!-- single case study -->
			<div class="flex h-[400px] w-full items-center justify-center overflow-hidden">
				<img
					class="h-full w-full object-cover"
					src={data.SingleCase.image}
					alt={data.SingleCase.title}
					width="1024"
					height="1024"
				/>
			</div>
			<p class="heading-md text-accent mt-[30px]">{data.SingleCase.title}</p>
			<div class="text-accent body-lg mt-[10px]">Challenge</div>
			{#each paragraphs(data.SingleCase.challenge) as text, i (i)}
				<p class="body-md text-accent mt-[10px]">{text}</p>
			{/each}
			<div class="text-accent body-lg">Solution</div>
			{#each paragraphs(data.SingleCase.solution) as text, i (i)}
				<p class="body-md text-accent mt-[10px]">{text}</p>
			{/each}
		</div>
		<div class="col-span-10 flex flex-col md:hidden">
			<p class="heading-xl">Related Cases</p>
		</div>

		<div class="col-span-10 flex flex-row gap-3 md:col-span-3 md:flex-col">
			{#each data.related as caseStudy, index (caseStudy.slug)}
				<a
					href="/case-studies/{caseStudy.slug}"
					class="group/eachPost hover:shadow-primary/30 active:shadow-primary/50 relative flex
					w-full transform cursor-pointer flex-col gap-[11px] pb-5 transition-all duration-300
					 ease-out hover:translate-x-1 hover:shadow-lg active:translate-x-0.5 active:scale-98 active:shadow-md
           {index !== 0 ? 'md:mt-[20px]' : ''}
					"
				>
					<div class="flex w-full items-center justify-center overflow-hidden">
						<img
							class="h-[150px] w-full rounded-lg object-cover transition-transform duration-[2s] ease-in-out group-hover/eachPost:scale-130 md:h-full md:object-contain"
							src={caseStudy.image}
							alt={caseStudy.title}
							loading="lazy"
							width="1024"
							height="1024"
						/>
					</div>
					<p class="body-lg text-secondary px-2 md:mt-[24px]">{caseStudy.title}</p>
				</a>
			{/each}
		</div>
	</div>
</div>

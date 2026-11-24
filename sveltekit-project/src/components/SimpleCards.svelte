<script lang="ts">
	import { reveal } from '#lib/actions/reveal.ts';
	import ButtonOutline from './ButtonOutline.svelte';
	import { goto } from '$app/navigation';
	import type { Section } from '#lib/content/index.ts';
	interface Props {
		section: Section;
		gridCols?: string;
		consultation?: boolean;
	}
	let { section, gridCols = 'md:col-span-6 xl:col-span-4', consultation = false }: Props = $props();
</script>

<div class="paddingContainer mt-[30px] flex flex-col xl:mt-[96px]">
	<p class="heading-xl">{section.title}</p>
	<p class="body-lg w-12/12 xl:w-9/12">
		{section.subtitle}
	</p>
	<div class="mt-4 grid w-full grid-cols-12 justify-items-center gap-4 xl:gap-[30px]">
		{#each section.items as content, i (content.title)}
			<div
				use:reveal={(i % 4) * 110}
				class="col-span-12 flex w-full flex-col items-center justify-start {gridCols}"
			>
				<div class="flex h-[300px] w-full max-w-[300px] items-center justify-center">
					<img
						class=" h-full max-w-full object-contain"
						src={content.image}
						alt=""
						loading="lazy"
						width="600"
						height="600"
					/>
				</div>
				<p class="heading-md text-secondary-ink mt-[24px] self-start">{content.title}</p>
				<p class="body-lg text-accent mt-[11px] self-start">{content.text}</p>
			</div>
		{/each}
	</div>
	{#if consultation}
		<div class="mt-[40px] flex items-center justify-center">
			<ButtonOutline
				buttonTxt="Get a consultation"
				onclick={() => {
					goto('/contact-us#contact-form');
				}}
			/>
		</div>
	{/if}
</div>

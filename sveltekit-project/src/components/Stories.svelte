<script lang="ts">
	import { reveal } from '#lib/actions/reveal.ts';
	import { section, stories } from '#lib/content/index.ts';
	import ButtonOutline from './ButtonOutline.svelte';
	import { goto } from '$app/navigation';

	const heading = section('stories');
</script>

<div class="paddingContainer mt-[96px] flex flex-col">
	<p class="heading-xl">{heading.title}</p>
	<p class="body-lg w-12/12 xl:w-9/12">{heading.subtitle}</p>
	<div class="mt-[45px] grid grid-cols-12 gap-x-1.5 xl:gap-x-[30px]">
		{#each stories as story, i (story.title)}
			<div
				use:reveal={(i % 3) * 110}
				class="text-primary col-span-12 flex flex-col items-start justify-start gap-[14px] md:col-span-4"
			>
				<p class=" text-secondary heading-md">{story.title}</p>
				<p class="body-lg text-accent">{story.desc}</p>
				<p class="text-secondary body-lg">{story.writer}</p>
			</div>
		{/each}
		<div class="col-span-12 mt-8 flex items-center justify-center">
			<ButtonOutline
				buttonTxt="View Case Studies"
				onclick={() => {
					goto('/case-studies');
				}}
			/>
		</div>
	</div>
</div>

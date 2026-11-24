<script lang="ts">
	import { reveal } from '#lib/actions/reveal.ts';
	import { section } from '#lib/content/index.ts';
	const impact = section('impact');
</script>

<div class="paddingContainer mt-[50px] flex flex-col xl:mt-[96px]">
	<p class="heading-xl">{impact.title}</p>
	<p class="body-lg w-9/12">{impact.subtitle}</p>
	<div class="mt-[45px] grid grid-cols-12 gap-3 xl:gap-[30px]">
		{#each impact.items as item, i (item.label)}
			<div
				use:reveal={i * 110}
				class="text-primary col-span-12 mt-3 flex flex-col items-center justify-start gap-x-[24px] md:col-span-3 md:mt-0"
			>
				<p class="heading-xl font-bold">{item.value}</p>
				<p class="body-lg">{item.label}</p>
			</div>
		{/each}
	</div>

	<p class="heading-xxl text-secondary mt-[45px] self-center font-bold">{impact.highlight.value}</p>
	<p class="text-secondary mt-[10px] self-center">{impact.highlight.label}</p>
</div>

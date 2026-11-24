<script lang="ts">
	import { section } from '#lib/content/index.ts';
	const timeline = section('timeline');
</script>

<div class="paddingContainer mt-[96px] flex flex-col">
	<p class="heading-xl">{timeline.title}</p>
	<p class="body-lg w-9/12">
		{timeline.subtitle}
	</p>
	<!-- timeline -->
	<div class="relative mt-[48px] flex w-full flex-col">
		<div class="bg-secondary absolute left-[50%] h-full w-[5px] -translate-x-[50%]"></div>
		{#each timeline.items as item, index (item.title)}
			<div
				class="flex flex-col xl:flex-row
			{index !== 0 ? 'mt-[48px]' : ''}
			{index % 2 === 0 ? 'pl-[50%]' : ' pr-[50%] xl:flex-row-reverse'}
			"
			>
				<!-- year-->
				<div
					class="flex items-center xl:justify-between {index % 2 === 0
						? 'justify-start'
						: 'justify-end'}"
				>
					<span
						class="bg-secondary h-[5px] w-[20px] xl:block
						{index % 2 === 0 ? 'block' : 'hidden '}"
					></span>
					<p class="text-secondary heading-md px-[12px] py-[6px]">{item.year}</p>
					<span
						class="bg-secondary h-[5px] w-[20px] xl:block
						{index % 2 === 0 ? 'hidden' : 'block '}"
					></span>
				</div>
				<!-- title / description -->
				<div
					class="flex flex-col gap-[11px]
				{index % 2 === 0 ? 'ps-[12px]' : 'pe-[12px] text-right'}
				"
				>
					<p class="heading-md text-secondary">{item.title}</p>
					<p class="heading-sm text-accent">
						{item.text}
					</p>
				</div>
			</div>
		{/each}
	</div>
</div>

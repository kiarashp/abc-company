<script lang="ts">
	import { reveal } from '#lib/actions/reveal.ts';
	import { section } from '#lib/content/index.ts';
	const team = section('team');
</script>

<div class="paddingContainer mt-[96px] flex flex-col">
	<p class="heading-xl">{team.title}</p>
	<p class="body-lg w-12/12 xl:w-9/12">
		{team.subtitle}
	</p>
	<div class="mt-[45px] grid w-full grid-cols-12 gap-x-[10px] gap-y-5 xl:gap-x-[30px]">
		{#each team.items as person, i (person.name)}
			<div use:reveal={(i % 3) * 110} class="col-span-6 flex flex-col md:col-span-4">
				<div class="flex w-full items-center justify-center">
					<img
						class=" h-full w-auto rounded-lg object-contain"
						src={person.photo}
						alt={person.name}
						loading="lazy"
						width="1024"
						height="1024"
					/>
				</div>
				<p class="heading-md text-secondary-ink mt-[24px]">{person.name}</p>
				<p class="body-lg text-accent mt-[11px]">{person.role}</p>
			</div>
		{/each}
	</div>
</div>

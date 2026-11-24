<script lang="ts">
	import ourTeams from '#lib/db/ourTeam.ts';
</script>

<div class="paddingContainer mt-[96px] flex flex-col">
	<p class="heading-xl">Meet Our Team</p>
	<p class="body-lg w-12/12 xl:w-9/12">
		Our global team of experienced engineers, consultants, and project managers is the backbone of
		ABC Company. With a shared passion for problem-solving and innovation, we’re dedicated to
		delivering exceptional results for every client.
	</p>
	<div class="mt-[45px] grid w-full grid-cols-12 gap-x-[10px] gap-y-5 xl:gap-x-[30px]">
		{#each ourTeams as ourTeam (ourTeam.title)}
			<div class="col-span-6 flex flex-col md:col-span-4">
				<div class="flex w-full items-center justify-center">
					<img
						class=" h-full w-auto rounded-lg object-contain"
						src="/our-team/{ourTeam.imgUrl}.webp"
						alt={ourTeam.title}
						loading="lazy"
						width="1024"
						height="1024"
					/>
				</div>
				<p class="heading-md text-secondary mt-[24px]">{ourTeam.title}</p>
				<p class="body-lg text-accent mt-[11px]">{ourTeam.desc}</p>
			</div>
		{/each}
	</div>
</div>

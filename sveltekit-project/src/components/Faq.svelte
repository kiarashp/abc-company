<script lang="ts">
	import { reveal } from '#lib/actions/reveal.ts';
	import { section } from '#lib/content/index.ts';
	const faq = section('faq');
	let openedFaq = $state<number | null>(null);
	function accordionClicked(faqId: number) {
		// is it the same opened one
		if (faqId === openedFaq) {
			openedFaq = null;
		} else {
			openedFaq = faqId;
		}
	}
</script>

<div class="paddingContainer mt-[96px] flex flex-col">
	<p class="heading-xl">{faq.title}</p>
	<p class="body-lg w-12/12 xl:w-9/12">
		{faq.subtitle}
	</p>
	<div class="bg-accent mt-[45px] h-0.5 w-full"></div>

	{#each faq.items as item, id (item.question)}
		<!-- each faq -->
		<div use:reveal class="flex w-full flex-col bg-white">
			<button
				class="mt-[26px] flex cursor-pointer items-center justify-between gap-3 px-[24px]"
				onclick={() => accordionClicked(id)}
				aria-expanded={id === openedFaq}
				aria-controls={`faq-panel-${id}`}
				id={`faq-button-${id}`}
			>
				<p class="heading-md text-primary cursor-pointer text-start duration-300 active:scale-95">
					{item.question}
				</p>

				{#if id != openedFaq}
					<!-- plus -->
					<div
						class="  flex h-[1.5rem] min-w-[1.5rem] cursor-pointer items-center justify-center transition-transform duration-100 active:scale-50"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							class="pointer-events-none h-full w-full"
							><!-- Icon from Google Material Icons by Material Design Authors - https://github.com/material-icons/material-icons/blob/master/LICENSE --><path
								fill="#151D26"
								d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"
							/></svg
						>
					</div>
				{:else}
					<!-- minus -->
					<div
						class="flex h-[1.5rem] min-w-[1.5rem] cursor-pointer items-center justify-center transition-transform duration-100 active:scale-50"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							class="pointer-events-none h-full w-full"
							><!-- Icon from Google Material Icons by Material Design Authors - https://github.com/material-icons/material-icons/blob/master/LICENSE --><path
								fill="#151D26"
								d="M19 12.998H5v-2h14z"
							/></svg
						>
					</div>
				{/if}
			</button>
			<div
				id={`faq-panel-${id}`}
				role="region"
				aria-labelledby={`faq-button-${id}`}
				class="eachFaq text-accent body-lg overflow-hidden px-[24px] {id !== openedFaq
					? 'closed'
					: 'opened'}"
			>
				<p class="pt-[22px]">{item.answer}</p>
			</div>
			<div class="bg-accent mt-[26px] h-0.5 w-full"></div>
		</div>
	{/each}
</div>

<style>
	.eachFaq.closed {
		animation: closeFaq 0.4s ease-out forwards;
	}

	.eachFaq.opened {
		animation: openFaq 0.4s ease-in;
	}
	@keyframes openFaq {
		from {
			max-height: 0;
			opacity: 0;
		}
		to {
			max-height: 1000px;
			opacity: 1;
		}
	}
	@keyframes closeFaq {
		from {
			max-height: 1000px;
			opacity: 1;
		}
		to {
			max-height: 0px;
			opacity: 0;
		}
	}
</style>

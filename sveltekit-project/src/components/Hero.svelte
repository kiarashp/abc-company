<script lang="ts">
	import Header from './Header.svelte';
	import ButtonPrimary from './ButtonPrimary.svelte';
	import { goto } from '$app/navigation';
	import { section, type Page } from '#lib/content/index.ts';

	interface Props {
		// The page's content file (src/content/pages/*.json): its top text and search-engine text.
		page: Page;
		showGrowingClients?: boolean;
	}
	const { page, showGrowingClients = false }: Props = $props();
	const clients = section('clients');
</script>

<svelte:head>
	<title>{page.seoTitle}</title>
	<meta name="description" content={page.seoDescription} />
	<!-- The soft circle behind this top part is the first big thing on screen: fetch it first. -->
	<link rel="preload" as="image" href="/decorative/shady-circle.webp" fetchpriority="high" />
</svelte:head>

<div
	class="paddingContainer relative flex flex-col justify-start bg-[url('/decorative/shady-circle.webp')] bg-contain bg-top
	  bg-no-repeat pb-[20px] xl:min-h-screen xl:pb-[30px]"
>
	<Header />

	<p class="heading-xxl mt-[105px] w-12/12 xl:w-10/12">{page.title}</p>
	<p class="body-lg mt-[24px] w-12/12 xl:w-10/12">
		{page.subtitle}
	</p>
	<p class="body-lg mt-[68px] w-12/12 self-end xl:w-6/12">
		{page.description}
	</p>
	<div
		class="mt-[24px] flex w-12/12 flex-col items-center gap-[24px] self-end md:flex-row xl:w-6/12"
	>
		<ButtonPrimary
			btnTxt="Get a consultation"
			onclick={() => {
				goto('/contact-us#contact-form');
			}}
		/>
		<a
			class="body-md hover:decoration-secondary hover:text-accent active:text-primary active:decoration-primary inline-block py-2 font-semibold underline duration-300"
			href="/case-studies">View Case Studies</a
		>
	</div>
	{#if showGrowingClients}
		<div class="heading-sm mt-9 self-center font-semibold xl:mt-[138px]">
			{clients.title}
		</div>
		<div class="mt-[26px] grid w-full grid-cols-12 justify-items-center gap-3.5 xl:gap-[1.8rem]">
			{#each clients.items as client (client.logo)}
				<div class="col-span-6 md:col-span-4 xl:col-span-2">
					<img class="h-full w-full object-contain" src={client.logo} alt={client.name} />
				</div>
			{/each}
		</div>
	{/if}
</div>

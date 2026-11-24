<script lang="ts">
	import '../app.css';
	import Footer from '#components/Footer.svelte';
	// The main font file (Latin letters). Loaded early so text does not jump when it arrives.
	import fontUrl from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="preload" as="font" type="font/woff2" href={fontUrl} crossorigin="anonymous" />
</svelte:head>

<div
	class="relative mx-auto flex min-h-screen max-w-[1800px] flex-col overflow-hidden bg-[url(/decorative/experties-bg.webp)] bg-center bg-repeat"
>
	<!-- noise overlay -->
	<div
		class="pointer-events-none absolute inset-0 z-10 m-[2px] bg-[url('/decorative/noise.webp')] opacity-10"
	></div>
	<main class="z-20">{@render children()}</main>
	<Footer />
</div>

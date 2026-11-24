<script lang="ts">
	import Hero from '#components/Hero.svelte';
	import Experties from '#components/Experties.svelte';
	import OurImpact from '#components/OurImpact.svelte';
	import WhyAbc from '#components/WhyAbc.svelte';
	import Stories from '#components/Stories.svelte';
	import Faq from '#components/Faq.svelte';
	import { page } from '#lib/content/index.ts';
</script>

<Hero page={page('home')} showGrowingClients={true} />
<Experties />
<OurImpact />
<WhyAbc />
<Stories />
<Faq />

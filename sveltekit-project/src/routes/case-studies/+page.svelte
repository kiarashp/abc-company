<script lang="ts">
	import Hero from '#components/Hero.svelte';
	import CaseStudies from '#components/CaseStudies.svelte';
	import { page } from '#lib/content/index.ts';
</script>

<Hero page={page('case-studies')} />
<CaseStudies />

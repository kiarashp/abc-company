<script lang="ts">
	import Hero from '../../components/Hero.svelte';
	import CaseStudies from '../../components/CaseStudies.svelte';
</script>

<svelte:head>
	<title>Case Studies — ABC Company</title>
	<meta name="description" content="See how ABC Company has helped businesses worldwide with tailored engineering solutions." />
</svelte:head>


<Hero
	title="Case Studies"
	subtitle="Proven Success Across Industries"
	description="Explore how ABC Company has empowered businesses worldwide with tailored engineering solutions that deliver measurable results."
	showGrowingClients={false}
/>
<CaseStudies />

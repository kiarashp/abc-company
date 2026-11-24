<script lang="ts">
	import Hero from '../../components/Hero.svelte';
	import Experties from '#components/Experties.svelte';
</script>

<svelte:head>
	<title>Services — ABC Company</title>
	<meta
		name="description"
		content="Consulting, legacy migration, ERP, automated teams and cybersecurity services from ABC Company."
	/>
</svelte:head>

<Hero
	title="Our Services"
	subtitle="Transforming Businesses with Tailored Engineering Solutions"
	description="From startups to multinational enterprises, our services are designed to address your unique challenges and help you achieve measurable success."
	showGrowingClients={false}
/>
<Experties />

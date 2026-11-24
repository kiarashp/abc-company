<script lang="ts">
	import experties from '#lib/db/experties.ts';
	import SimpleCards from './SimpleCards.svelte';
</script>

<SimpleCards
	title="Our Expertise"
	subtitle="We specialize in delivering tailored solutions to address your business needs across these key
		areas:"
	contents={experties}
	consultation={true}
/>

<script lang="ts">
import whyAbcs from '#lib/db/whyAbc.ts';
import SimpleCards from './SimpleCards.svelte';
</script>

<SimpleCards
	title="Why Choose ABC Company?"
	subtitle="We provide end-to-end solutions to help businesses across industries overcome challenges,
		innovate, and scale."
	contents={whyAbcs}
	gridCols="md:col-span-4 xl:col-span-4"
/>



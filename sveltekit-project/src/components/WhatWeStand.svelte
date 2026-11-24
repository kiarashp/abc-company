<script lang="ts">
	import { section } from '#lib/content/index.ts';
	import SimpleCards from './SimpleCards.svelte';
</script>

<SimpleCards section={section('values')} gridCols="md:col-span-6 xl:col-span-3" />

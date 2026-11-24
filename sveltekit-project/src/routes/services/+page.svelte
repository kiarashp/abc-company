<script lang="ts">
	import Hero from '#components/Hero.svelte';
	import Experties from '#components/Experties.svelte';
	import { page } from '#lib/content/index.ts';
</script>

<Hero page={page('services')} />
<Experties />

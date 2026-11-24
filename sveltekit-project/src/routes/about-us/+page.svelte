<script lang="ts">
	import Hero from '#components/Hero.svelte';
	import TimeLine from '#components/TimeLine.svelte';
	import WhatWeStand from '#components/WhatWeStand.svelte';
	import OurTeam from '#components/OurTeam.svelte';
	import JoinUs from '#components/JoinUs.svelte';
	import OurFocus from '#components/OurFocus.svelte';
	import { page } from '#lib/content/index.ts';
</script>

<Hero page={page('about-us')} />
<TimeLine />
<WhatWeStand />
<OurTeam />
<JoinUs />
<OurFocus />

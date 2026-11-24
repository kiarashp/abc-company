<script lang="ts">
	import { section } from '#lib/content/index.ts';
	const quote = section('quote');
</script>

<figure
	class="paddingContainer mt-[60px] flex w-full flex-col items-center gap-[45px] xl:mt-[96px]"
>
	<blockquote class="heading-xl text-center text-pretty">“{quote.text}”</blockquote>
	<figcaption class="text-secondary body-lg text-center">
		{quote.name}
		<br />
		{quote.role}
	</figcaption>
</figure>

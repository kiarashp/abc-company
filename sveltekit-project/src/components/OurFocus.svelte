<script lang="ts">
	import { reveal } from '#lib/actions/reveal.ts';
	import { section } from '#lib/content/index.ts';
	const quote = section('quote');
</script>

<figure
	use:reveal
	class="paddingContainer mt-[60px] flex w-full flex-col items-center gap-[45px] xl:mt-[96px]"
>
	<blockquote class="heading-xl text-center text-pretty">“{quote.text}”</blockquote>
	<figcaption class="text-secondary-ink body-lg text-center">
		{quote.name}
		<br />
		{quote.role}
	</figcaption>
</figure>

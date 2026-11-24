// "Reveal on scroll": an element fades and slides in when it scrolls into view.
// Use it as <div use:reveal> or <div use:reveal={150}> (a delay in milliseconds, for a staggered row).
//
// Careful choices:
// - Elements already on screen when the page opens are left alone, so the first view never flickers
//   and Google's speed test sees the content at once.
// - Nothing is hidden until the page's JavaScript runs, so the text is always there without it.
// - People who asked their device for less motion get no animation at all.
export function reveal(node: HTMLElement, delay = 0) {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	if (node.getBoundingClientRect().top < window.innerHeight) return;

	node.classList.add('reveal', 'reveal-hidden');
	node.style.transitionDelay = `${delay}ms`;

	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				node.classList.remove('reveal-hidden');
				observer.disconnect();
			}
		},
		{ rootMargin: '0px 0px -8% 0px' }
	);
	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}

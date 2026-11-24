import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			preprocess: vitePreprocess(),
			// adapter-node: builds the site as a small Node.js server
			// (Node.js runs JavaScript outside the browser), so it can run on our own VPS.
			adapter: adapter()
		})
	]
	// Short folder names like "#lib/..." and "#components/..." are set in package.json under "imports".
});

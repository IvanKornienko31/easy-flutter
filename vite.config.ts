import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import Icons from 'unplugin-icons/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte',
			autoInstall: true
		}),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: false,
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
			}
		})
	],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom',
		globals: true
	}
});

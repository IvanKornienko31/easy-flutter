<script lang="ts">
	import '../app.css'; // Импорт глобальных стилей
	import Header from '$lib/components/Header.svelte';
	import SearchModal from '$lib/components/SearchModal.svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';
	import Favicon from '$lib/assets/favicon.ico';

	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });

	let { children, data } = $props();
</script>

<svelte:head>
	<meta property="og:site_name" content="EasyFlutter" />
	<meta property="og:locale" content="ru_RU" />
	<meta property="og:type" content="website" />
	<link rel="icon" href="{Favicon}">
</svelte:head>

<div class="app-container">
	<Header />

	<main>
		{@render children()}
	</main>

	<!-- Временный Footer -->
	<footer style="padding: 1rem; background: var(--color-primary); color: white; margin-top: auto; text-align:center">
		© 2025 EasyFlutter
	</footer>

	<SearchModal searchIndex={data.searchIndex} />
	<SettingsModal />
</div>

<style>
	.app-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
	}
</style>
<script lang="ts">
	import { onMount } from 'svelte';
	import Fuse from 'fuse.js';
	import { uiState } from '$lib/state/ui.svelte';
	import { resolve } from '$app/paths';

	// Иконки
	import IconSearch from '~icons/mdi/magnify';
	import IconClose from '~icons/mdi/close';
	import IconBook from '~icons/mdi/book-open-page-variant-outline';

	// Типизация элементов поиска
	interface SearchItem {
		title: string;
		slug: string;
		tags: string[];
		description: string;
	}

	// Пропсы
	let { searchIndex } = $props<{ searchIndex: SearchItem[] }>();

	// Состояние
	let query = $state('');
	// Ссылки на DOM элементы теперь реактивны
	let inputRef = $state<HTMLInputElement | null>(null);
	let resultsWrapperRef = $state<HTMLDivElement | null>(null);

	let isAnimating = $state(false);
	let placeholderText = $state('Мы не можем искать пустоту в пустоте');

	// Настройка Fuse.js
	// Инициализируем один раз, так как searchIndex не меняется на лету
	// svelte-ignore state_referenced_locally
	const fuse = new Fuse(searchIndex, {
		keys: ['title', 'tags', 'description'],
		threshold: 0.4,
		ignoreLocation: true
	});

	// --- Логика поиска ---

	// 1. Точные совпадения
	let exactMatches = $derived(
		query
			? searchIndex.filter((item: SearchItem) =>
					item.title.toLowerCase().includes(query.toLowerCase())
				)
			: []
	);

	// 2. Нечеткие совпадения (исключая точные)
	let fuzzyMatches = $derived.by(() => {
		if (!query) return [];
		const rawResults = fuse.search(query);
		const exactSlugs = new Set(exactMatches.map((i: SearchItem) => i.slug));

		return rawResults.map((r) => r.item as SearchItem).filter((item) => !exactSlugs.has(item.slug));
	});

	let hasResults = $derived(exactMatches.length > 0 || fuzzyMatches.length > 0);

	// --- Обработчики ---

	function handleKeydown(e: KeyboardEvent) {
		// Глобальный перехват Ctrl+K
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
			e.preventDefault(); // Блокируем браузерный поиск
			uiState.openSearch();
			return;
		}

		if (uiState.isSearchOpen) {
			if (e.key === 'Escape') {
				e.preventDefault();
				uiState.closeSearch();
			}
			if (e.key === 'Enter') {
				e.preventDefault(); // Блокируем сабмит формы
				triggerEnterAnimation();
			}
		}
	}

	function triggerEnterAnimation() {
		isAnimating = true;
		setTimeout(() => {
			isAnimating = false;
		}, 200);
	}

	// Эффект при открытии/закрытии
	$effect(() => {
		if (uiState.isSearchOpen) {
			// Блокируем скролл страницы
			document.body.style.overflow = 'hidden';

			// Фокус на инпут
			setTimeout(() => {
				if (inputRef) inputRef.focus();
			}, 50);

			// Рандом текста заглушки
			placeholderText =
				Math.random() > 0.5
					? 'Мы не можем искать пустоту в пустоте'
					: 'Пустота не может найти пустоту. Вспомните брадобрея!';
		} else {
			// Разблокируем скролл
			document.body.style.overflow = '';
			query = '';
		}
	});

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

{#if uiState.isSearchOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="backdrop" role="button" tabindex="0" onclick={() => uiState.closeSearch()}>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div class="modal-container" role="dialog" tabindex="-1" onclick={(e) => e.stopPropagation()}>
			<!-- HEADER -->
			<div class="search">
				<div class="search-header">
					<span class="search-icon">
						<IconSearch />
					</span>

					<input
						bind:this={inputRef}
						bind:value={query}
						type="text"
						placeholder="Введите название урока или ключевое слово"
						class="search-input"
						enterkeyhint="search"
					/>
				</div>
				<div class="close-wrapper">
					<button class="close-btn" onclick={() => uiState.closeSearch()}>
						<IconClose />
					</button>
					<span class="esc-hint">Esc</span>
				</div>
			</div>

			<!-- BODY -->
			<div class="search-body" bind:this={resultsWrapperRef} class:scale-effect={isAnimating}>
				{#if !query}
					<!-- 1. НИЧЕГО НЕ ВВЕЛИ (Старт) -->
					<div class="empty-state">
						<h3 class="empty-title">Вы пока что ничего не ввели</h3>
						<span class="sad-face">=(</span>
						<p class="empty-text">{placeholderText}</p>
					</div>
				{:else if !hasResults}
					<!-- 2. НИЧЕГО НЕ НАЙДЕНО (Есть запрос, нет результатов) -->
					<div class="empty-state">
						<h3 class="empty-title">Ничего не найдено</h3>
						<span class="sad-face">=(</span>
						<p class="empty-text">Попробуйте изменить запрос или поискать в рубрикаторе</p>
					</div>
				{:else}
					<!-- 3. РЕЗУЛЬТАТЫ -->
					<div class="results-list">
						{#if exactMatches.length > 0}
							<div class="result-group">
								<h3 class="group-title">
									Найден {exactMatches.length}
									{exactMatches.length === 1 ? 'урок' : 'урока'} с подобным заголовком
								</h3>
								{#each exactMatches as post (post.slug)}
									<a
										href={resolve(`/lessons/[slug]`, {
											slug: post.slug
										})}
										class="result-item"
										onclick={() => uiState.closeSearch()}
									>
										<span class="item-icon"><IconBook /></span>
										<span class="item-text">{post.title}</span>
									</a>
								{/each}
							</div>
						{/if}

						{#if fuzzyMatches.length > 0}
							<div class="result-group">
								<h3 class="group-title">
									Найден {fuzzyMatches.length}
									{fuzzyMatches.length === 1 ? 'урок' : 'урока'}, близких по теме
								</h3>
								{#each fuzzyMatches as post (post.slug)}
									<a
										href={resolve(`/lessons/[slug]`, {
											slug: post.slug
										})}
										class="result-item"
										onclick={() => uiState.closeSearch()}
									>
										<span class="item-icon"><IconBook /></span>
										<span class="item-text">{post.title}</span>
									</a>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	/* --- VARIABLES --- */
	.backdrop {
		--modal-primary: var(--color-primary);
		--modal-accent: var(--color-accent);
		--modal-text: var(--color-text);
		--modal-surface: var(--color-surface);

		--modal-overlay: rgba(0, 0, 0, 0.5);
		--modal-placeholder: var(--color-text-secondary);
		--modal-hint: var(--color-text-secondary);

		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: var(--modal-overlay);
		z-index: 1000;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding-top: 10vh;
		backdrop-filter: blur(2px);
	}

	.modal-container {
		width: 100%;
		max-width: 800px;
		background-color: transparent;
		display: flex;
		flex-direction: column;
		gap: 24px;
		padding: 0 1rem;
		outline: none;
	}

	/* --- SEARCH HEADER --- */
	.search {
		display: flex;
		gap: 16px;
	}

	.search-header {
		background-color: var(--modal-accent);
		width: 100%;
		border-radius: 40px;
		height: 48px;
		padding: 0 24px;
		display: flex;
		align-items: center;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
		position: relative;
	}

	.search-icon {
		font-size: 2rem;
		color: var(--modal-text); /* Теперь это реагирует на тему */
		display: flex;
		align-items: center;
		margin-right: 16px;
	}

	.search-input {
		flex: 1;
		background: transparent;
		border: none;
		font-family: 'Roboto', sans-serif;
		font-size: 1.25rem;
		color: var(--modal-text); /* Теперь это реагирует на тему */
		outline: none;
		height: 100%;
	}

	.search-input::placeholder {
		color: var(--modal-placeholder);
	}

	.close-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}

	.close-btn {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: var(--modal-accent);
		border: none;
		color: var(--modal-text);
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.close-btn:hover {
		opacity: 0.9;
	}

	.esc-hint {
		font-size: 0.75rem;
		color: var(--modal-hint);
		font-weight: 500;
		opacity: 0.8;
	}

	/* --- SEARCH BODY --- */
	.search-body {
		background-color: var(--modal-surface); /* Белый/Темно-синий */
		border-radius: 24px;
		max-height: 60vh;
		overflow-y: auto;
		/* Используем глобальную тень */
		box-shadow: var(--shadow-modal, 0 4px 12px rgba(0, 0, 0, 0.1));
		transition:
			transform 0.15s ease-out,
			background-color 0.3s;
	}

	.scale-effect {
		transform: scale(1.02);
	}

	/* --- EMPTY STATE --- */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20px;
		text-align: center;
	}

	.sad-face {
		font-size: 6rem;
		font-weight: 700;
		color: var(--modal-text);
		line-height: 1;
		margin-bottom: 24px;
	}

	.empty-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--modal-primary);
		margin: 0 0 8px 0;
	}

	.empty-text {
		font-size: 1.25rem;
		color: var(--modal-text);
		max-width: 400px;
		margin: 0;
		opacity: 0.8;
	}

	/* --- RESULTS LIST --- */
	.results-list {
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.group-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--modal-primary);
		margin: 0 0 12px 0;
		border-bottom: 2px solid var(--modal-primary);
		padding-bottom: 8px;
	}

	.result-item {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 12px;
		border-radius: 12px;
		text-decoration: none;
		color: var(--modal-text);
		transition: background 0.2s;
	}

	.result-item:hover {
		background-color: rgba(127, 127, 127, 0.1); /* Универсальный ховер */
	}

	.item-icon {
		font-size: 1.5rem;
		color: var(--modal-primary);
		display: flex;
	}

	.item-text {
		font-size: 1.375rem;
		font-weight: 500;
	}

	/* =========================================
	   ADAPTIVE STYLES
	   ========================================= */

	/* Tablet (< 1240px) */
	@media (width < 1240px) {
		.modal-container {
			max-width: 90%;
		}
	}

	/* Mobile (< 600px) */
	@media (width < 600px) {
		.backdrop {
			padding-top: 0;
			align-items: center; /* Центр по вертикали */
		}

		.modal-container {
			/* ИСПРАВЛЕНО: Отступы вместо Full Screen */
			width: calc(100% - 32px); /* 16px отступа с каждой стороны */
			max-height: calc(100vh - 64px); /* Чтобы не прилипало к краям */
			height: auto;
			padding: 0; /* Внутренний паддинг контейнера убираем, отступы задаем элементам */
			gap: 16px;
		}

		.search-header {
			height: 64px;
			padding: 0 16px;
			border-radius: 24px; /* Чуть меньше скругление */
		}

		.search-body {
			/* Ограничиваем высоту контента */
			max-height: 50vh;
		}

		.search-icon {
			font-size: 1.5rem;
			margin-right: 12px;
		}

		.search-input {
			font-size: 1rem;
		}

		.close-btn {
			width: 32px;
			height: 32px;
			font-size: 1.25rem;
		}

		.sad-face {
			font-size: 4rem;
		}

		.group-title {
			font-size: 1.25rem;
		}

		.item-text {
			font-size: 1.125rem;
		}
	}
</style>

<script lang="ts">
	import { resolve } from '$app/paths';
	import { SvelteSet } from 'svelte/reactivity';
	import { slide } from 'svelte/transition'; // Анимация сворачивания

	// Иконки (Outline версия для Book Ribbon, как просил, и стрелки)
	import IconBook from '~icons/mdi/book-open-page-variant-outline';
	import IconArrowDown from '~icons/mdi/keyboard-arrow-down';
	import IconArrowUp from '~icons/mdi/keyboard-arrow-up';

	// Данные от сервера (из +page.server.ts)
	let { data } = $props();

	// Состояние открытых глав.
	let expandedChapters = $state(new Set<string>());

	$effect(() => {
		if (data.chapters.length > 0) {
			expandedChapters = new Set([data.chapters[0].id]);
		}
	});

	// Функция переключения состояния главы
	function toggleChapter(id: string) {
		const newSet = new SvelteSet(expandedChapters);
		if (newSet.has(id)) {
			newSet.delete(id);
		} else {
			newSet.add(id);
		}
		expandedChapters = newSet;
	}
</script>

<svelte:head>
	<title>Рубрикатор — EasyFlutter</title>
</svelte:head>

<div class="rubricator-page">
	<div class="page-header">
		<h1 class="page-title">Рубрикатор</h1>
		<p class="page-subtitle">Здесь уроки сгруппированы по главам</p>
	</div>

	<div class="chapters-list">
		{#each data.chapters as chapter (chapter.id)}
			<div class="chapter-item">
				<!-- Заголовок главы (Кнопка аккордеона) -->
				<button
					class="chapter-header"
					onclick={() => toggleChapter(chapter.id)}
					aria-expanded={expandedChapters.has(chapter.id)}
				>
					<span class="chapter-icon">
						{#if expandedChapters.has(chapter.id)}
							<IconArrowUp />
						{:else}
							<IconArrowDown />
						{/if}
					</span>
					<span class="chapter-title-text">{chapter.title}</span>
				</button>

				<!-- Список уроков (Слайдер) -->
				{#if expandedChapters.has(chapter.id)}
					<div class="chapter-content" transition:slide={{ duration: 300 }}>
						{#each chapter.posts as post (post.slug)}
							<a
								href={resolve('/lessons/[slug]', {
									slug: post.slug
								})}
								class="lesson-link"
							>
								<span class="lesson-icon">
									<IconBook />
								</span>
								<span class="lesson-title">{post.title}</span>
							</a>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	/* --- ЛОКАЛЬНЫЕ ПЕРЕМЕННЫЕ ПО ТЗ --- */
	.rubricator-page {
		background-color: var(--color-bg);
		min-height: 100vh;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 40px 1rem;
	}

	.page-header {
		margin-bottom: 40px;
	}

	.page-title {
		color: var(--color-primary);
		font-size: 3rem;
		font-weight: 700;
		margin: 0 0 16px 0;
		line-height: 1.2;
	}

	.page-subtitle {
		color: var(--color-text);
		font-size: 1.5rem;
		margin: 0;
	}

	/* --- СПИСОК ГЛАВ --- */
	.chapters-list {
		border-top: 2px solid var(--color-text);
	}

	.chapter-item {
		border-bottom: 2px solid var(--color-text);
	}

	/* Кнопка заголовка главы */
	.chapter-header {
		width: 100%;
		display: flex;
		align-items: center;
		padding: 16px 0;
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
		color: var(--color-text);
		gap: 20px;
		transition: opacity 0.2s;
	}

	.chapter-header:hover {
		opacity: 0.8;
		color: var(--color-primary);
	}

	.chapter-icon {
		font-size: 3rem;
		display: flex;
		align-items: center;
		height: 100%;
		padding: 4px 0 0 4px;
	}

	.chapter-title-text {
		font-size: 2.25rem;
		font-weight: 700;
		line-height: 1.2;
	}

	/* --- СПИСОК УРОКОВ --- */
	.chapter-content {
		padding-left: 72px;
	}

	.lesson-link {
		display: flex;
		align-items: center;
		padding: 16px 0;
		text-decoration: none;
		color: var(--color-text);
		gap: 20px;
		border-top: 2px solid var(--color-text);
	}

	.lesson-link:first-child {
		border-top: none;
	}

	.lesson-link:hover {
		color: var(--color-accent);
	}

	.lesson-icon {
		font-size: 2.25rem;
		display: flex;
	}

	.lesson-title {
		font-size: 2.25rem;
		font-weight: 700;
	}

	/* Tablet (600px — 1240px): Оптимизация отступов и шрифтов */
	@media (width < 1240px) {
		.page-title {
			font-size: 2.5rem;
		}

		.chapter-title-text {
			font-size: 1.75rem;
		}

		.chapter-icon {
			font-size: 2.5rem;
		}

		.chapter-content {
			padding-left: 48px;
		}

		.lesson-title {
			font-size: 1.75rem;
		}

		.lesson-icon {
			font-size: 1.75rem;
		}
	}

	/* Mobile (< 600px): Линеаризация и Touch-области */
	@media (width < 600px) {
		.rubricator-page {
			padding: 24px 1rem;
		}

		.page-header {
			margin-bottom: 32px;
		}

		.page-title {
			font-size: 2rem;
			line-height: 1.1;
			padding-top: 64px;
		}

		.page-subtitle {
			font-size: 1.125rem;
		}

		.chapter-header {
			padding: 20px 0;
			gap: 16px;
		}

		.chapter-title-text {
			font-size: 1.375rem;
		}

		.chapter-icon {
			font-size: 2rem;
			padding-top: 2px;
		}

		.chapter-content {
			padding-left: 0;
		}

		.lesson-link {
			padding-block: 16px;
			padding-left: 9px;
			gap: 12px;
		}

		.lesson-title {
			font-size: 1.25rem;
			line-height: 1.3;
		}

		.lesson-icon {
			font-size: 1.5rem;
			min-width: 24px;
		}
	}
</style>

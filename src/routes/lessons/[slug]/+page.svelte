	<script lang="ts">
		// Данные от сервера
		let { data } = $props();

		// --- Логика копирования кода ---
		// Используем Svelte Action, чтобы повесить обработчики на "сырой" HTML
		function setupCopy(node: HTMLElement) {
			const handleClick = async (event: MouseEvent) => {
				const target = (event.target as HTMLElement).closest('.copy-btn');
				if (!target) return;

				// Находим сам блок кода рядом с кнопкой
				// Структура: .code-block-wrapper -> .code-header -> button
				// Нам нужно: .code-block-wrapper -> pre
				const wrapper = target.closest('.code-block-wrapper');
				const pre = wrapper?.querySelector('pre');

				if (pre && pre.textContent) {
					try {
						await navigator.clipboard.writeText(pre.textContent);

						// Визуальный фидбек (меняем цвет иконки временно)
						target.classList.add('copied');
						setTimeout(() => target.classList.remove('copied'), 2000);
					} catch (err) {
						console.error('Ошибка копирования:', err);
					}
				}
			};

			node.addEventListener('click', handleClick);

			return {
				destroy() {
					node.removeEventListener('click', handleClick);
				}
			};
		}
	</script>

	<svelte:head>
		<title>{data.post.title} — EasyFlutter</title>
		<meta name="description" content={data.post.description} />

		<meta property="og:title" content="{data.post.title} — EasyFlutter" />
		<meta property="og:description" content={data.post.description} />
		<meta property="og:type" content="article" />
	</svelte:head>

	<div class="lesson-page">
		<!-- Заголовок урока -->
		<header class="lesson-header">
			<h1 class="lesson-title">{data.post.title}</h1>

			{#if data.post.tags && data.post.tags.length > 0}
				<div class="tags-section">
					<span class="tags-label">Теги:</span>
					<div class="tags-list">
						{#each data.post.tags as tag}
							<span class="tag-chip">{tag}</span>
						{/each}
					</div>
				</div>
			{/if}
		</header>

		<!-- Контент урока (Markdown HTML) -->
		<!-- use:setupCopy вешает обработчик кликов на весь контейнер -->
		<article class="lesson-content markdown-body" use:setupCopy>
			{@html data.content}
		</article>
	</div>

	<style>
		/* --- ЛОКАЛЬНЫЕ ПЕРЕМЕННЫЕ ПО ТЗ --- */
		.lesson-page {
			--lp-bg: var(--color-bg);
			--lp-primary: var(--color-primary);
			--lp-text: var(--color-text);
			--lp-surface: var(--color-surface);

			width: 100%;
			max-width: 1200px;
			margin: 0 auto;
			padding: 40px 1rem;
			min-height: 100vh;
		}

		/* --- HEADER --- */
		.lesson-header {
			margin-bottom: 48px;
			border-bottom: 2px solid rgba(0, 0, 0, 0.1);
			padding-bottom: 32px;
		}

		.lesson-title {
			font-size: 3rem;
			font-weight: 700;
			color: var(--lp-primary);
			line-height: 1.2;
			margin: 0 0 24px 0;
		}

		.tags-section {
			display: flex;
			align-items: center;
			gap: 16px;
			flex-wrap: wrap;
		}

		.tags-label {
			font-size: 1.5rem;
			font-weight: 700;
			color: var(--lp-primary);
		}

		.tags-list {
			display: flex;
			gap: 12px;
			flex-wrap: wrap;
		}

		.tag-chip {
			background-color: var(--lp-surface);
			color: var(--lp-text);
			padding: 2px 6px;
			border-radius: 4px;
			font-size: 1rem;
			box-shadow: -1px 4px 12px rgba(0, 0, 0, 0.25);
		}

		/* --- КОНТЕНТ (MARKDOWN STYLES) --- */

		:global(.markdown-body) {
			font-family: 'Roboto', sans-serif;
			font-size: 1.25rem;
			line-height: 1.6;
			color: var(--lp-text);
		}

		/* Отступы для текста */
		:global(.markdown-body p),
		:global(.markdown-body ul),
		:global(.markdown-body ol) {
			margin-bottom: 1.5rem;
		}

		/* Заголовки внутри статьи */
		:global(.markdown-body h2) {
			font-size: 2rem;
			color: var(--lp-primary);
			margin-top: 2.5rem;
			margin-bottom: 1rem;
			font-weight: 700;
		}

		:global(.markdown-body h3) {
			font-size: 1.5rem;
			color: var(--lp-primary);
			margin-top: 2rem;
			margin-bottom: 0.75rem;
			font-weight: 700;
		}

		/* --- БЛОК КОДА (Кастомизация Shiki Wrapper) --- */
		:global(.code-block-wrapper) {
			margin: 2rem 0;
			border-radius: 8px;
			overflow: hidden;
			background-color: var(--shiki-bg, #272822); 
			border: 1px solid var(--shiki-border, transparent); /* Рамка, если нужна */

			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
			transition: background-color 0.3s, border-color 0.3s;
		}

		:global(.code-block-wrapper pre) {
			margin: 0;
			padding: 16px;
			overflow-x: auto;
			background-color: transparent !important;

			font-size: var(--code-font-size, 14px) !important;
			line-height: var(--code-line-height, 1.5) !important;
			letter-spacing: var(--code-letter-spacing, normal) !important;
		}

		/* Шапка блока кода */
		:global(.code-header) {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 8px 16px;
			background-color: rgba(125, 125, 125, 0.1);
			border-bottom: 1px solid var(--shiki-border, rgba(255, 255, 255, 0.1));
		}

		:global(.code-lang) {
			color: var(--shiki-fg);
			font-family: monospace;
			font-size: 0.85rem;
			text-transform: uppercase;
			opacity: 0.7;
		}

		:global(html[data-code-theme='light'] .code-lang) {
			color: #000;
		}

		/* Кнопка копирования */
		:global(.copy-btn) {
			background: transparent;
			border: none;
			color: var(--shiki-fg);
			cursor: pointer;
			opacity: 0.7;
			padding: 4px;
			border-radius: 4px;
			transition: all 0.2s;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		:global(html[data-code-theme='light'] .copy-btn) {
			color: #000000;
		}

		:global(.copy-btn:hover) {
			opacity: 1;
			background-color: rgba(255, 255, 255, 0.1);
		}

		/* Состояние "Скопировано" (зеленая) */
		:global(.copy-btn.copied) {
			color: #a6e22e;
			opacity: 1;
		}

		/* Сам Shiki контейнер */
		:global(.code-block-wrapper pre) {
			margin: 0;
			padding: 16px;
			overflow-x: auto;
			background-color: transparent !important;

			font-size: var(--code-font-size, 0.9rem);
			line-height: var(--code-line-height, 1.5);
			letter-spacing: var(--code-letter-spacing, normal);
		}

		:global(.code-block-wrapper code) {
			font-family: 'Consolas', 'Monaco', 'Andale Mono', monospace;
			font-size: inherit;
		}

		/* Tablet (600px — 1240px): Оптимизация отступов и адаптация шрифтов */
		@media (width < 1240px) {
			.lesson-page {
				max-width: 100%;
				padding: 32px 2rem;
			}

			.lesson-title {
				font-size: 2.5rem;
			}

			:global(.markdown-body h2) {
				font-size: 1.75rem;
			}

			:global(.markdown-body h3) {
				font-size: 1.25rem;
			}
		}

		/* Mobile (< 600px): Линеаризация и Touch-области */
		@media (width < 600px) {
			.lesson-page {
				padding: 24px 1rem;
				width: 100%;
			}

			.lesson-header {
				margin-block: 64px 32px;
				padding-bottom: 24px;
			}

			.lesson-title {
				font-size: 2rem;
				line-height: 1.2;
				margin-bottom: 16px;
			}

			.tags-section {
				gap: 12px;
			}

			.tags-label {
				font-size: 1.25rem;
			}

			:global(.markdown-body) {
				font-size: 1rem;
			}

			:global(.markdown-body h2) {
				font-size: 1.5rem;
				margin-top: 2rem;
			}

			:global(.code-block-wrapper) {
				margin-left: -1rem;
				margin-right: -1rem;
				width: calc(100% + 2rem);
				border-radius: 0;
			}

			:global(.code-header) {
				padding: 12px 16px;
			}
		}
	</style>

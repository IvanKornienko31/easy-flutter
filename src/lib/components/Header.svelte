<script lang="ts">
	// Импорт иконок (благодаря unplugin-icons они станут SVG компонентами)
	import IconSearch from '~icons/mdi/magnify';
	import IconSettings from '~icons/mdi/tune'; // Иконка настроек
	import IconList from '~icons/mdi/format-list-bulleted'; // Рубрикатор
	import IconClose from '~icons/mdi/close'; // Крестик (на всякий случай)
	import { uiState } from '$lib/state/ui.svelte';
</script>

<header class="header">
	<div class="header-container">
		<!-- 1. ЛЕВАЯ ЧАСТЬ: Логотип -->
		<div class="header-left">
			<a href="/" class="logo"> EasyFlutter </a>
		</div>

		<!-- 2. ЦЕНТРАЛЬНАЯ ЧАСТЬ: Поиск (Абсолютное центрирование) -->
		<div class="header-center">
			<!-- Десктопный поиск (Поле ввода) -->
			<button class="search-bar" aria-label="Поиск" onclick={() => uiState.openSearch()}>
				<span class="search-icon-wrapper">
					<IconSearch />
				</span>
				<span class="search-placeholder">Нажмите Ctrl + K для поиска</span>
			</button>
		</div>

		<!-- 3. ПРАВАЯ ЧАСТЬ: Действия -->
		<div class="header-right">
			<!-- Иконка поиска (только для мобильных/планшетов) -->
			<button class="icon-btn mobile-only" aria-label="Поиск" onclick={() => uiState.openSearch()}>
				<IconSearch />
			</button>

			<!-- Настройки -->
			<button class="icon-btn" aria-label="Настройки интерфейса" onclick={() => uiState.openSettings()}>
				<IconSettings />
			</button>

			<!-- Рубрикатор -->
			<a href="/rubricator" class="rubricator-btn" aria-label="Рубрикатор">
				<span class="btn-icon"><IconList /></span>
				<span class="desktop-text">Рубрикатор</span>
			</a>
		</div>
	</div>
</header>

<style>
	/* --- ЛОКАЛЬНЫЕ ПЕРЕМЕННЫЕ --- */
	header {
		--header-bg: var(--color-primary);
		--header-accent: var(--color-accent);
		--header-text: var(--color-text);
		--header-text-placeholder: var(--color-text-placeholder);

		/* Размеры */
		--container-max-width: 1200px;
		--header-height: 80px;
	}

	.header {
		background-color: var(--header-bg);
		height: var(--header-height);
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: sticky;
		top: 0;
		z-index: 100;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.header-container {
		width: 100%;
		max-width: var(--container-max-width);
		padding: 0 1rem;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
	}

	/* --- Логотип --- */
	.logo {
		font-family: 'Roboto', sans-serif;
		font-weight: 500;
		font-size: 1.5rem;
		color: var(--header-text);
		text-decoration: none;
		white-space: nowrap;
	}

	/* --- Поиск (Центральный блок) --- */
	.header-center {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		max-width: 400px;
		pointer-events: none;
	}

	.search-bar {
		pointer-events: auto;
		width: 100%;
		height: 48px;
		background-color: var(--header-accent);
		border: none;
		border-radius: 24px;
		display: flex;
		align-items: center;
		padding: 0 16px;
		cursor: text;
		transition: opacity 0.2s;
	}

	.search-bar:hover {
		opacity: 0.9;
		cursor: pointer;
	}

	.search-icon-wrapper {
		font-size: 1.5rem;
		color: var(--header-text);
		display: flex;
		align-items: center;
		margin-right: 12px;
	}

	.search-placeholder {
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		color: var(--header-text-placeholder);
	}

	/* --- Правая часть (Кнопки) --- */
	.header-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.icon-btn {
		background: var(--header-accent);
		border: none;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--header-text);
		font-size: 24px;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.icon-btn:hover {
		opacity: 0.9;
	}

	/* Кнопка Рубрикатор (Большая) */
	.rubricator-btn {
		text-decoration: none;
		background-color: var(--header-accent);
		color: var(--header-text);
		height: 48px;
		padding: 0 24px;
		border-radius: 24px;
		border: none;
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
	}

	.btn-icon {
		font-size: 1.5rem;
		display: flex;
	}

	.mobile-only {
		display: none;
	}

	/* =========================================
	   TABLET STYLES (600px - 1240px)
	   ========================================= */
	@media (width < 1240px) {
		.rubricator-btn {
			width: 48px;
			padding: 1px 4px;
			justify-content: center;
		}

		.desktop-text {
			display: none;
		}

		.logo {
			font-size: 1.375rem;
		}
	}

	@media (width < 700px) {
		.header-center {
			display: none;
		}
		.mobile-only {
			display: flex;
		}
	}

	/* =========================================
	   MOBILE STYLES (< 600px)
	   ========================================= */
	@media (width < 600px) {
		.header {
			--header-height: 64px;
			box-shadow: none;
			position: absolute;
		}

		.logo {
			font-size: 1.25rem;
		}

		/* Правая часть сжимается */
		.header-right {
			gap: 8px;
		}

		.icon-btn,
		.rubricator-btn {
			width: 40px;
			height: 40px;
			font-size: 24px;
		}

		.icon-btn,
		.btn-icon {
			font-size: 24px;
		}
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import { uiState } from '$lib/state/ui.svelte';
	import { settings } from '$lib/state/settings.svelte';

	// Иконки
	import IconClose from '~icons/mdi/close';
	import IconSun from '~icons/mdi/white-balance-sunny'; // light_mode аналог
	import IconMoon from '~icons/mdi/weather-night'; // dark_mode аналог
	import IconArrowDown from '~icons/mdi/keyboard-arrow-down';

	// Список тем для кода (пока просто выбор, реальная смена цвета требует сложной логики Shiki на клиенте)
	const codeThemes = [
		{ value: 'monokai', label: 'Monokai' },
		{ value: 'github-dark', label: 'GitHub Dark' },
		{ value: 'github-light', label: 'GitHub Light' },
		{ value: 'dracula', label: 'Dracula' },
		{ value: 'nord', label: 'Nord' }
	];

	function handleKeydown(e: KeyboardEvent) {
		if (uiState.isSettingsOpen && e.key === 'Escape') {
			uiState.closeSettings();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

{#if uiState.isSettingsOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="backdrop" role="button" tabindex="0" onclick={() => uiState.closeSettings()}>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div class="modal-container" role="dialog" tabindex="-1" onclick={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<h2 class="settings-title">Настройки</h2>

				<div class="close-wrapper">
					<button class="close-btn" onclick={() => uiState.closeSettings()}>
						<IconClose />
					</button>
					<span class="esc-hint">Esc</span>
				</div>
			</div>

			<div class="modal-content">
				<!-- ========================
				     1. НАСТРОЙКИ САЙТА 
				     ======================== -->
				<section class="settings-group">
					<h3 class="group-title">Настройки сайта</h3>

					<!-- Тема -->
					<div class="control-row">
						<span class="control-label">Тема сайта</span>
						<div
							class="theme-toggle"
							onclick={() => settings.toggleTheme()}
							role="button"
							tabindex="0"
							onkeydown={(e) => e.key === 'Enter' && settings.toggleTheme()}
						>
							<div class="toggle-track"></div>
							<div class="toggle-thumb" class:is-dark={settings.theme === 'dark'}>
								{#if settings.theme === 'light'}
									<IconSun class="toggle-icon sun" />
								{:else}
									<IconMoon class="toggle-icon moon" />
								{/if}
							</div>
						</div>
					</div>

					<!-- Размер шрифта -->
					<div class="control-row stacked">
						<div class="range-header">
							<span class="control-label">Размер шрифта</span>
							<span class="range-value">{settings.fontSize}px</span>
						</div>
						<div class="range-wrapper">
							<input
								type="range"
								min="12"
								max="24"
								step="1"
								bind:value={settings.fontSize}
								class="custom-range"
							/>
							<div class="range-labels">
								<span>12px</span>
								<span>24px</span>
							</div>
						</div>
					</div>

					<!-- Разреженность -->
					<div class="control-row stacked">
						<div class="range-header">
							<span class="control-label">Разреженность шрифта</span>
							<!-- Превращаем 0, 1, 2 в текстовые метки -->
							<span class="range-value">
								{settings.letterSpacing === 0
									? 'Норм.'
									: settings.letterSpacing > 0
										? 'Бол.'
										: 'Мал.'}
							</span>
						</div>
						<div class="range-wrapper">
							<input
								type="range"
								min="-1"
								max="2"
								step="0.5"
								bind:value={settings.letterSpacing}
								class="custom-range"
							/>
							<div class="range-labels">
								<span>Мал.</span>
								<span>Средн.</span>
								<span>Бол.</span>
							</div>
						</div>
					</div>

					<!-- Интервал -->
					<div class="control-row stacked">
						<div class="range-header">
							<span class="control-label">Межстрочный интервал</span>
							<span class="range-value">{settings.lineHeight}</span>
						</div>
						<div class="range-wrapper">
							<input
								type="range"
								min="1.0"
								max="2.0"
								step="0.1"
								bind:value={settings.lineHeight}
								class="custom-range"
							/>
							<div class="range-labels">
								<span>1.0</span>
								<span>2.0</span>
							</div>
						</div>
					</div>
				</section>

				<div class="divider"></div>

				<!-- ========================
				     2. НАСТРОЙКИ КОДА 
				     ======================== -->
				<section class="settings-group">
					<h3 class="group-title">Настройки блоков кода</h3>

					<!-- Выбор схемы (Dropdown) -->
					<div class="control-row">
						<span class="control-label">Цветовая схема</span>
						<div class="custom-select-wrapper">
              <IconArrowDown class="select-arrow" />
							<select bind:value={settings.codeScheme} class="custom-select">
								{#each codeThemes as theme}
									<option value={theme.value}>{theme.label}</option>
								{/each}
							</select>
						</div>
					</div>

					<!-- Размер кода -->
					<div class="control-row stacked">
						<div class="range-header">
							<span class="control-label">Размер кода</span>
							<span class="range-value">{settings.codeFontSize}px</span>
						</div>
						<div class="range-wrapper">
							<input
								type="range"
								min="12"
								max="24"
								step="1"
								bind:value={settings.codeFontSize}
								class="custom-range"
							/>
							<div class="range-labels">
								<span>12px</span>
								<span>24px</span>
							</div>
						</div>
					</div>

					<!-- Разреженность кода -->
					<div class="control-row stacked">
						<div class="range-header">
							<span class="control-label">Разреженность кода</span>
							<span class="range-value">{settings.codeLetterSpacing}px</span>
						</div>
						<div class="range-wrapper">
							<input
								type="range"
								min="-1"
								max="2"
								step="0.5"
								bind:value={settings.codeLetterSpacing}
								class="custom-range"
							/>
							<div class="range-labels">
								<span>Мал.</span>
								<span>Средн.</span>
								<span>Бол.</span>
							</div>
						</div>
					</div>

					<!-- Интервал кода -->
					<div class="control-row stacked">
						<div class="range-header">
							<span class="control-label">Межстрочный интервал</span>
							<span class="range-value">{settings.codeLineHeight}</span>
						</div>
						<div class="range-wrapper">
							<input
								type="range"
								min="1.0"
								max="2.0"
								step="0.1"
								bind:value={settings.codeLineHeight}
								class="custom-range"
							/>
							<div class="range-labels">
								<span>1.0</span>
								<span>2.0</span>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>
{/if}

<style>
	/* --- VARIABLES --- */
	.backdrop {
		/* СВЯЗЫВАЕМ С ГЛОБАЛЬНЫМИ */
		--set-primary: var(--color-primary);
		--set-accent: var(--color-accent);
		--set-text: var(--color-text);
		--set-surface: var(--color-surface);
		
		--set-overlay: rgba(0, 0, 0, 0.5);
		
		position: fixed;
		top: 0; left: 0; width: 100%; height: 100%;
		background-color: var(--set-overlay);
		z-index: 1100;
		display: flex;
		justify-content: center;
		align-items: center;
		backdrop-filter: blur(2px);
	}

	.modal-container {
		width: 100%;
		max-width: 800px;
		max-height: 90vh;
		background-color: var(--set-surface);
		border-radius: 32px;
		display: flex;
		flex-direction: column;
		padding: 40px;
		overflow-y: auto;
		box-shadow: var(--shadow-modal, 0 10px 25px rgba(0,0,0,0.2));
		transition: background-color 0.3s;
	}

	.modal-header {
		display: flex;
		justify-content: flex-end;
		align-items: flex-start;
		margin-bottom: 32px;
	}

	.settings-title {
		font-size: 2.75rem;
		font-weight: 700;
		color: var(--set-primary);
		margin: 0 auto;
		line-height: 1.2;
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
		background: var(--set-accent);
		border: none;
		color: var(--set-text);
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.close-btn:hover { opacity: 0.9; }

	.esc-hint {
		font-size: 0.875rem;
		color: var(--set-text);
		opacity: 0.8;
		font-weight: 500;
	}

	.modal-content {
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	/* --- ГРУППЫ НАСТРОЕК --- */
	.group-title {
		font-size: 2rem;
		font-weight: 700;
		color: var(--set-primary);
		margin: 0 0 24px 0;
		border-bottom: 2px solid var(--set-primary);
		padding-bottom: 8px;
	}

	.control-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
	}

	.control-row.stacked {
		flex-direction: column;
		align-items: stretch;
		gap: 12px;
	}

	.control-label {
		font-size: 1.75rem;
		font-weight: 500;
		color: var(--set-text);
	}

	.divider {
		height: 2px;
		background-color: var(--color-border); /* Глобальный бордер */
		margin: 0 -40px;
	}

	/* --- TOGGLE SWITCH --- */
	.theme-toggle {
		width: 80px;
		height: 40px;
		background-color: var(--set-accent);
		border-radius: 20px;
		position: relative;
		cursor: pointer;
		box-shadow: inset 0 4px 4px rgba(0,0,0,0.25);
	}

	.toggle-thumb {
		width: 32px;
		height: 32px;
		background-color: var(--set-primary);
		border-radius: 50%;
		position: absolute;
		top: 4px;
		left: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
		color: white; /* Иконка внутри всегда белая */
	}

	.toggle-thumb.is-dark {
		transform: translateX(40px);
	}

	.toggle-icon {
		font-size: 18px;
	}

	/* --- SELECT --- */
	.custom-select-wrapper {
    background-color: var(--set-accent);
    border-radius: 12px;
    padding-left: 16px;
		position: relative;
		width: 200px;
    display: flex;
    align-items: center;
	}
  
	.custom-select {
    width: 100%;
    background-color: var(--set-accent);
		appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

		color: var(--set-text);
		border: none;

		padding: 10px 16px;
		padding-right: 40px;

		border-radius: 12px;

    font-family: inherit;
		font-size: 1rem;
    line-height: 1.5;

    cursor: pointer;

    text-overflow: ellipsis;
    white-space: nowrap;
	}

	/* --- RANGE SLIDER --- */
	.range-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
	}

	.range-value {
		font-size: 1rem;
		color: var(--set-text);
		opacity: 0.7;
	}

	.custom-range {
		-webkit-appearance: none;
		width: 100%;
		height: 6px;
		background: #E2E8F0; /* Серый трек можно оставить или заменить на var(--color-border) */
		border-radius: 3px;
		outline: none;
		margin: 16px 0;
	}

	/* Thumb стили */
	.custom-range::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--set-primary);
		cursor: pointer;
		border: 2px solid white;
		box-shadow: 0 2px 4px rgba(0,0,0,0.2);
	}

	.custom-range::-moz-range-thumb {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--set-primary);
		cursor: pointer;
		border: 2px solid white;
		box-shadow: 0 2px 4px rgba(0,0,0,0.2);
	}

	.custom-range::-moz-range-progress {
		background-color: var(--set-accent);
		height: 6px;
		border-radius: 3px;
	}

	.range-labels {
		display: flex;
		justify-content: space-between;
		font-size: 0.875rem;
		color: var(--set-text);
		opacity: 0.6;
	}

	/* =========================================
	   ADAPTIVE
	   ========================================= */
	
	/* Tablet (< 1240px) */
	@media (width < 1240px) {
		.settings-title { font-size: 2rem; }
		.group-title { font-size: 1.75rem; }
		.control-label { font-size: 1.5rem; }
	}

	/* Mobile (< 600px) */
	@media (width < 600px) {
		.modal-container {
			/* ИСПРАВЛЕНО: Отступы на мобилке */
			width: calc(100% - 32px);
			max-height: calc(100vh - 64px);
			padding: 24px;
			border-radius: 24px;
			height: auto;
		}

		.settings-title { font-size: 1.75rem; }
		.group-title { font-size: 1.5rem; }
		.control-label { font-size: 1.25rem; }
		
		.control-row {
			margin-bottom: 20px;
		}
		
		.divider {
			margin: 0 -24px; /* Коррекция под новый паддинг */
		}
	}
</style>

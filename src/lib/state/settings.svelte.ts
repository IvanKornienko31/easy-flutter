import { browser } from '$app/environment';

class SettingsState {
	// --- SITE SETTINGS ---
	// Используем руны $state для реактивности
	theme = $state<'light' | 'dark'>('light');
	fontSize = $state(16); // px
	letterSpacing = $state(0); // px
	lineHeight = $state(1.5); // float

	// --- CODE SETTINGS ---
	codeTheme = $state<'light' | 'dark'>('dark');
	codeScheme = $state('monokai');
	codeFontSize = $state(14); // px
	codeLetterSpacing = $state(0); // px
	codeLineHeight = $state(1.5); // float

	constructor() {
		if (browser) {
			this.load();
			// $effect.root нужен, чтобы эффект жил вне компонента (глобально)
			$effect.root(() => {
				$effect(() => {
					this.save();
					this.apply();
				});
			});
		}
	}

	load() {
		const stored = localStorage.getItem('easyflutter-settings');
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				// Аккуратно обновляем поля, сохраняя реактивность
				this.theme = parsed.theme ?? 'light';
				this.fontSize = parsed.fontSize ?? 16;
				this.letterSpacing = parsed.letterSpacing ?? 0;
				this.lineHeight = parsed.lineHeight ?? 1.5;

				this.codeTheme = parsed.codeTheme ?? 'dark';
				this.codeScheme = parsed.codeScheme ?? 'monokai';
				this.codeFontSize = parsed.codeFontSize ?? 14;
				this.codeLetterSpacing = parsed.codeLetterSpacing ?? 0;
				this.codeLineHeight = parsed.codeLineHeight ?? 1.5;
			} catch (e) {
				console.error('Ошибка загрузки настроек', e);
			}
		}
	}

	save() {
		const data = {
			theme: this.theme,
			fontSize: this.fontSize,
			letterSpacing: this.letterSpacing,
			lineHeight: this.lineHeight,
			codeTheme: this.codeTheme,
			codeScheme: this.codeScheme,
			codeFontSize: this.codeFontSize,
			codeLetterSpacing: this.codeLetterSpacing,
			codeLineHeight: this.codeLineHeight
		};
		localStorage.setItem('easyflutter-settings', JSON.stringify(data));
	}

	apply() {
		const root = document.documentElement;

		// 1. Применяем тему сайта
		root.setAttribute('data-theme', this.theme);

		// 2. Применяем CSS переменные сайта
		root.style.setProperty('--base-font-size', `${this.fontSize}px`);
		root.style.setProperty('--base-letter-spacing', `${this.letterSpacing}px`);
		root.style.setProperty('--base-line-height', `${this.lineHeight}`);

		// 3. Применяем настройки кода
		// ВАЖНО: Эти переменные нужны для независимого управления кодом
		root.style.setProperty('--code-font-size', `${this.codeFontSize}px`);
		root.style.setProperty('--code-letter-spacing', `${this.codeLetterSpacing}px`);
		root.style.setProperty('--code-line-height', `${this.codeLineHeight}`);

		// Тема кода (для инверсии цветов в CSS)
    root.setAttribute('data-code-scheme', this.codeScheme);
		root.setAttribute('data-code-theme', this.codeTheme);
	}

	toggleTheme() {
		this.theme = this.theme === 'light' ? 'dark' : 'light';
	}

	toggleCodeTheme() {
		this.codeTheme = this.codeTheme === 'light' ? 'dark' : 'light';
	}
}

export const settings = new SettingsState();

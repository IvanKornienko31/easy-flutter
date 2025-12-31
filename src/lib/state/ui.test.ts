import { describe, it, expect, beforeEach } from 'vitest';
import { uiState } from './ui.svelte';

// Vitest позволяет тестировать JS/TS логику очень просто
describe('UI State Logic', () => {
	// Перед каждым тестом сбрасываем состояние
	beforeEach(() => {
		uiState.closeSearch();
		uiState.closeSettings();
	});

	it('should have initial state closed', () => {
		expect(uiState.isSearchOpen).toBe(false);
		expect(uiState.isSettingsOpen).toBe(false);
	});

	it('should open search and close settings', () => {
		// Сначала откроем настройки
		uiState.openSettings();
		expect(uiState.isSettingsOpen).toBe(true);

		// Теперь открываем поиск -> настройки должны закрыться
		uiState.openSearch();
		expect(uiState.isSearchOpen).toBe(true);
		expect(uiState.isSettingsOpen).toBe(false);
	});

	it('should open settings and close search', () => {
		uiState.openSearch();
		expect(uiState.isSearchOpen).toBe(true);

		uiState.openSettings();
		expect(uiState.isSettingsOpen).toBe(true);
		expect(uiState.isSearchOpen).toBe(false);
	});
});

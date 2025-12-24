// src/lib/state/ui.svelte.ts
export const uiState = $state({
	isSearchOpen: false,
	isSettingsOpen: false,

	toggleSearch() {
		this.isSearchOpen = !this.isSearchOpen;
	},
	openSearch() {
		this.isSearchOpen = true;
		this.isSettingsOpen = false;
	},
	closeSearch() {
		this.isSearchOpen = false;
	},

	openSettings() {
		this.isSettingsOpen = true;
		this.isSearchOpen = false;
	},
	closeSettings() {
		this.isSettingsOpen = false;
	}
});
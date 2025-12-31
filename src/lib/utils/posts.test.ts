import { describe, it, expect } from 'vitest';
import { extractOrderFromFilename } from './posts';

describe('Posts Utility', () => {
	it('should extract order from filename correctly', () => {
		expect(extractOrderFromFilename('01-intro.md')).toBe(1);
		expect(extractOrderFromFilename('10-advanced.md')).toBe(10);
		expect(extractOrderFromFilename('05-setup.md')).toBe(5);
	});

	it('should return 999 if no number found', () => {
		expect(extractOrderFromFilename('index.md')).toBe(999);
		expect(extractOrderFromFilename('intro-01.md')).toBe(999);
	});
});

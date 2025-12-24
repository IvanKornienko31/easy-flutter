import { error } from '@sveltejs/kit';
import { getPostBySlug } from '$lib/utils/posts';
import { marked } from 'marked';
import { createHighlighter } from 'shiki';
import { bundledLanguages } from 'shiki'; // Языки импортируем штатно, с ними проблем нет
import type { PageServerLoad } from './$types';

// ОПРЕДЕЛЯЕМ ТЕМУ ВРУЧНУЮ (Hardcoded Theme)
// Это исключает любые ошибки с поиском файлов module not found
const cssVariablesTheme = {
	name: 'css-variables',
	type: 'dark', // Базовый тип, но цвета будут из CSS
	colors: {
		'editor.background': '#00000000', // Прозрачный фон (зададим в CSS)
		'editor.foreground': 'var(--shiki-fg)',
		'editorLineNumber.foreground': 'var(--shiki-fg)',
		'editorLineNumber.activeForeground': 'var(--shiki-fg)'
	},
	tokenColors: [
		{
			scope: [
				'comment',
				'punctuation.definition.comment',
				'string.comment'
			],
			settings: {
				foreground: 'var(--shiki-token-comment)'
			}
		},
		{
			scope: [
				'constant',
				'entity.name.constant',
				'variable.other.constant',
				'variable.language',
				'support.constant',
				'meta.preprocessor'
			],
			settings: {
				foreground: 'var(--shiki-token-constant)'
			}
		},
		{
			scope: [
				'entity',
				'entity.name',
				'support.class',
				'support.type',
				'header' // Markdown headers
			],
			settings: {
				foreground: 'var(--shiki-token-function)'
			}
		},
		{
			scope: [
				'entity.name.function',
				'support.function',
				'meta.function-call'
			],
			settings: {
				foreground: 'var(--shiki-token-function)'
			}
		},
		{
			scope: [
				'keyword',
				'storage',
				'storage.type',
				'entity.name.tag',
				'punctuation.tag'
			],
			settings: {
				foreground: 'var(--shiki-token-keyword)'
			}
		},
		{
			scope: ['string', 'string.template', 'constant.other.symbol'],
			settings: {
				foreground: 'var(--shiki-token-string)'
			}
		},
		{
			scope: ['variable.parameter', 'meta.parameter'],
			settings: {
				foreground: 'var(--shiki-token-parameter)'
			}
		}
	]
};

// Загружаем языки (Dart и другие)
// Используем Object.values или конкретные ключи, чтобы Vite их увидел
const loadLang = async (lang: keyof typeof bundledLanguages) => {
	const mod = await bundledLanguages[lang]();
	return mod.default || mod;
};

const highlighter = await createHighlighter({
	themes: [
		cssVariablesTheme // Передаем наш объект темы
	],
	langs: [
		await loadLang('dart'),
		await loadLang('yaml'),
		await loadLang('bash'),
		await loadLang('json'),
		await loadLang('xml')
	]
});

export const load: PageServerLoad = async ({ params }) => {
	const post = await getPostBySlug(params.slug);

	if (!post) {
		throw error(404, 'Урок не найден');
	}

	const renderer = new marked.Renderer();

	renderer.code = ({ text, lang }) => {
		const language = lang || 'text';
		
		const html = highlighter.codeToHtml(text, {
			lang: language,
			theme: 'css-variables' // Ссылаемся на имя нашей кастомной темы
		});

		const copyIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z"/></svg>`;

		return `
			<div class="code-block-wrapper">
				<div class="code-header">
					<span class="code-lang">${language}</span>
					<button class="copy-btn" aria-label="Копировать код" title="Скопировать">
						${copyIconSvg}
					</button>
				</div>
				${html}
			</div>
		`;
	};

	const contentHtml = await marked.parse(post.content, { renderer });

	return {
		post,
		content: contentHtml
	};
};
import matter from 'gray-matter';

export interface Post {
	slug: string;
	title: string;
	date: string;
	description: string;
	tags: string[];
	order: number;
	chapter: string; // ID главы (название папки)
	content: string; // Сам текст урока (нужен для страницы урока)
}

export interface Chapter {
	id: string;
	title: string;
	posts: Post[];
}

// Словарь для красивых названий глав
const CHAPTER_NAMES: Record<string, string> = {
	'01-introduction': 'Введение',
	'02-dart-basics': 'Основы Dart',
	'03-oop': 'Объектно-ориентированное программирование',
	'04-flutter-basics': 'Основы Flutter'
};

/**
 * Получить все посты, сгруппированные по главам
 */
export const getGroupedPosts = async (): Promise<Chapter[]> => {
	const posts = await getAllPosts();

	// Группируем по главам
	const grouped: Record<string, Post[]> = {};

	posts.forEach((post) => {
		if (!grouped[post.chapter]) {
			grouped[post.chapter] = [];
		}
		grouped[post.chapter].push(post);
	});

	// Превращаем в массив глав и сортируем
	const chapters: Chapter[] = Object.keys(grouped)
		.sort()
		.map((chapterId) => {
			return {
				id: chapterId,
				title: CHAPTER_NAMES[chapterId] || chapterId,
				posts: grouped[chapterId].sort((a, b) => a.order - b.order)
			};
		});

	return chapters;
};

/**
 * Найти конкретный пост по его slug
 */
export const getPostBySlug = async (slug: string): Promise<Post | undefined> => {
	const posts = await getAllPosts();
	return posts.find((p) => p.slug === slug);
};

/**
 * Внутренняя функция: читает все файлы и парсит их
 */
export const getAllPosts = async (): Promise<Post[]> => {
	const modules = import.meta.glob('/src/content/**/*.md', {
		query: '?raw',
		import: 'default',
		eager: true
	});

	const posts: Post[] = [];

	for (const path in modules) {
		const fileContent = modules[path] as string;
		const { data, content } = matter(fileContent);

		// 1. Разбираем путь к файлу
		// path: /src/content/01-introduction/02-why-flutter.md
		const pathParts = path.split('/');
		const fileName = pathParts.pop() || ''; // 02-why-flutter.md
		const chapterFolder = pathParts.pop() || ''; // 01-introduction

		// 2. Вычисляем порядок (Order) из имени файла
		// Ищем цифры в начале файла: "02-..." -> 2
		const orderMatch = fileName.match(/^(\d+)-/);
		const orderFromFile = orderMatch ? parseInt(orderMatch[1], 10) : 999;

		if (data.slug) {
			posts.push({
				slug: data.slug,
				title: data.title,
				date: data.date,
				description: data.description,
				tags: data.tags || [],
				order: data.order ?? orderFromFile,
				chapter: chapterFolder,
				content: content
			});
		}
	}

	return posts;
};

export function extractOrderFromFilename(filename: string): number {
	const orderMatch = filename.match(/^(\d+)-/);
	return orderMatch ? parseInt(orderMatch[1], 10) : 999;
}

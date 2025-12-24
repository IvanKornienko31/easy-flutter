import { getAllPosts } from '$lib/utils/posts';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const posts = await getAllPosts();

	// Оптимизация: передаем на клиент только то, что нужно для поиска
	const searchIndex = posts.map((post) => ({
		title: post.title,
		slug: post.slug,
		tags: post.tags,
		description: post.description // Нужно для сниппета в результатах
	}));

	return {
		searchIndex
	};
};
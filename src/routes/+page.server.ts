import { getAllPosts } from '$lib/utils/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const allPosts = await getAllPosts();

	// Перемешиваем массив (алгоритм Фишера-Йетса)
	const shuffled = allPosts.sort(() => 0.5 - Math.random());

	// Берем первые 3
	const popularLessons = shuffled.slice(0, 3);

	return {
		popularLessons
	};
};

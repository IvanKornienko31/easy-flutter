import { getGroupedPosts } from '$lib/utils/posts';

export const load = async () => {
	const chapters = await getGroupedPosts();
	return {
		chapters
	};
};

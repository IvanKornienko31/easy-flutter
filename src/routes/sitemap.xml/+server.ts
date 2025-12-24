import { getAllPosts } from '$lib/utils/posts';

// Укажи здесь свой будущий домен на Vercel (или оставь пока localhost для тестов, но лучше поменять перед сдачей)
const SITE_URL = 'https://easyflutter-course.vercel.app'; 

export async function GET() {
	const posts = await getAllPosts();

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${SITE_URL}/</loc>
		<changefreq>daily</changefreq>
		<priority>1.0</priority>
	</url>
	<url>
		<loc>${SITE_URL}/rubricator</loc>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
	</url>
	${posts
		.map(
			(post) => `
	<url>
		<loc>${SITE_URL}/lessons/${post.slug}</loc>
		<lastmod>${new Date(post.date).toISOString()}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.7</priority>
	</url>`
		)
		.join('')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
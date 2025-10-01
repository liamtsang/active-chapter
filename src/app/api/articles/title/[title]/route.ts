// app/api/articles/[id]/route.ts
import * as server from "next/server";
import { unstable_cache } from "next/cache";
import { getArticlesByTitle } from "@/lib/db";

// Cache individual articles with ISR
const getCachedArticleByTitle = (title: string) => unstable_cache(
	async () => getArticlesByTitle(title),
	[`article-${title}`],
	{
		revalidate: 600, // 10 minutes for individual articles
		tags: ["articles", `article-${title}`],
	}
);

export async function GET(
	request: server.NextRequest,
	{ params }: { params: { title: string } },
) {
	try {
		const decodedTitle = decodeURIComponent(params.title.replace(/\+/g, " "));
		const getCachedArticle = getCachedArticleByTitle(decodedTitle);
		const article = await getCachedArticle();
		
		return server.NextResponse.json({ article: article }, {
			headers: {
				// ISR headers for individual articles
				'Cache-Control': 's-maxage=600, stale-while-revalidate=1200'
			}
		});
	} catch {
		return server.NextResponse.json(
			{ error: "Failed to fetch article" },
			{ status: 500 },
		);
	}
}

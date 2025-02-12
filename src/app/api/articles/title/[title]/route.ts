// app/api/articles/[id]/route.ts
import * as server from "next/server";
import { revalidateTag } from "next/cache";
import { getArticlesByTitle } from "@/lib/db";

export async function GET(
	request: server.NextRequest,
	{ params }: { params: { title: string } },
) {
	try {
		const decodedTitle = decodeURIComponent(params.title.replace(/\+/g, " "));
		const article = await getArticlesByTitle(decodedTitle);
		revalidateTag("articles");
		return server.NextResponse.json({ article: article });
	} catch {
		return server.NextResponse.json(
			{ error: "Failed to fetch article" },
			{ status: 500 },
		);
	}
}

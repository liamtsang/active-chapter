// app/api/articles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getArticleLinks } from "@/lib/db";

export async function GET() {
	try {
		const articles = await getArticleLinks();
		return NextResponse.json(articles);
	} catch (error) {
		console.error("Error fetching articles:", error);
		return NextResponse.json(
			{ error: "Failed to fetch articles" },
			{ status: 500 },
		);
	}
}

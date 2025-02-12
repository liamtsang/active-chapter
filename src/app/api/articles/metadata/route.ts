// app/api/articles/route.ts
import { NextResponse } from "next/server";
import { getMetadataTypes } from "@/lib/db";
import { unstable_cache } from "next/cache";

const getCachedUser = unstable_cache(
	async () => getMetadataTypes(),
	["articles"],
);

export async function GET() {
	try {
		const articles = await getCachedUser();
		return NextResponse.json(articles);
	} catch (error) {
		console.error("Error fetching metadat:", error);
		return NextResponse.json(
			{ error: "Failed to fetch metadata" },
			{ status: 500 },
		);
	}
}

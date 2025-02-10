// app/api/articles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getMetadataTypes } from "@/lib/db";

export async function GET() {
	try {
		const articles = await getMetadataTypes();
		return NextResponse.json(articles);
	} catch (error) {
		console.error("Error fetching metadat:", error);
		return NextResponse.json(
			{ error: "Failed to fetch metadata" },
			{ status: 500 },
		);
	}
}

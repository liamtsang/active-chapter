import { getDB } from "@/lib/db/metadata";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const db = getDB();

		// Example: Fetch all metadata types in parallel
		const [authors, journals, mediums, tags] = await Promise.all([
			db.prepare("SELECT name, slug FROM authors ORDER BY name").all(),
			db.prepare("SELECT name, slug FROM journals ORDER BY name").all(),
			db.prepare("SELECT name, slug FROM mediums ORDER BY name").all(),
			db.prepare("SELECT name, slug FROM tags ORDER BY name").all(),
		]);

		return NextResponse.json({
			authors: authors.results,
			journals: journals.results,
			mediums: mediums.results,
			tags: tags.results,
		});
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch metadata" },
			{ status: 500 },
		);
	}
}

type PostJSON = {
	type: string;
	name: string;
	slug: string;
};

export async function POST(request: Request) {
	try {
		const db = getDB();
		const { type, name, slug } = (await request.json()) as unknown as PostJSON;

		// Example: Insert a new metadata item
		const result = await db
			.prepare(`INSERT INTO ${type} (name, slug) VALUES (?, ?)`)
			.bind(name, slug)
			.run();

		console.log(result);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{ error: "Failed to add metadata item" },
			{ status: 500 },
		);
	}
}

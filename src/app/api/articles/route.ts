// app/api/articles/route.ts
import { getDB } from "@/lib/db/metadata";
import { NextResponse } from "next/server";

interface ArticleData {
	metadata: {
		title: string;
		author: string;
		publishDate: Date;
		tags: string[];
		journal: string;
		medium: string;
	};
	content: string;
}

interface D1Result {
	results: Array<{ id: number }>;
	success: boolean;
	meta: unknown;
}

export async function POST(request: Request) {
	try {
		const db = getDB();
		const articleData: ArticleData = await request.json();
		const { metadata, content } = articleData;

		// Start a transaction with all our operations
		const result = (await db.batch([
			// 1. Get or create author
			db
				.prepare(`
        INSERT INTO authors (name, slug) 
        VALUES (?, ?) 
        ON CONFLICT (slug) DO UPDATE SET name = ? 
        RETURNING id
      `)
				.bind(
					metadata.author,
					metadata.author.toLowerCase().replace(/\s+/g, "-"),
					metadata.author,
				),

			// 2. Get or create journal
			db
				.prepare(`
        INSERT INTO journals (name, slug) 
        VALUES (?, ?) 
        ON CONFLICT (slug) DO UPDATE SET name = ? 
        RETURNING id
      `)
				.bind(
					metadata.journal,
					metadata.journal.toLowerCase().replace(/\s+/g, "-"),
					metadata.journal,
				),

			// 3. Get or create medium
			db
				.prepare(`
        INSERT INTO mediums (name, slug) 
        VALUES (?, ?) 
        ON CONFLICT (slug) DO UPDATE SET name = ? 
        RETURNING id
      `)
				.bind(
					metadata.medium,
					metadata.medium.toLowerCase().replace(/\s+/g, "-"),
					metadata.medium,
				),

			// 4. Insert or update tags and get their IDs
			...metadata.tags.map((tag) =>
				db
					.prepare(`
          INSERT INTO tags (name, slug) 
          VALUES (?, ?) 
          ON CONFLICT (slug) DO UPDATE SET name = ? 
          RETURNING id
        `)
					.bind(tag, tag.toLowerCase().replace(/\s+/g, "-"), tag),
			),
		])) as unknown as D1Result[];

		// Extract IDs from the results
		const [
			authorResult,
			journalResult,
			mediumResult,
			...tagResults
		]: D1Result[] = result;
		const authorId = authorResult.results[0].id;
		const journalId = journalResult.results[0].id;
		const mediumId = mediumResult.results[0].id;
		const tagIds = tagResults.map((r) => r.results[0].id);

		// Insert the article
		const articleResult = await db
			.prepare(`
      INSERT INTO articles (
        title, 
        author_id, 
        journal_id, 
        medium_id, 
        publish_date, 
        content
      ) VALUES (?, ?, ?, ?, ?, ?)
      RETURNING id
    `)
			.bind(
				metadata.title,
				authorId,
				journalId,
				mediumId,
				new Date(metadata.publishDate).toISOString(),
				content,
			)
			.run();

		const articleId = articleResult.results[0].id;

		// Insert article-tag relationships
		if (tagIds.length > 0) {
			await db.batch(
				tagIds.map((tagId) =>
					db
						.prepare(
							"INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)",
						)
						.bind(articleId, tagId),
				),
			);
		}

		return NextResponse.json({
			success: true,
			articleId,
		});
	} catch (error) {
		console.error("Error saving article:", error);
		return NextResponse.json(
			{ error: "Failed to save article" },
			{ status: 500 },
		);
	}
}

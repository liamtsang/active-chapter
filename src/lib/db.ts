"use server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { D1Database } from "@cloudflare/workers-types";
import { revalidateTag, unstable_cache } from "next/cache";
import type { Article, Env } from "@/types";

// Types for our combo box items
export interface MetadataItem {
	label: string;
	value: string;
}

interface DBMetadataItem {
	name: string;
	slug: string;
}

export interface MetadataTypes {
	authors: MetadataItem[];
	journals: MetadataItem[];
	mediums: MetadataItem[];
	tags: MetadataItem[];
}

export interface SaveArticleRequest {
	title: string;
	author: string;
	publishDate: Date;
	tags: string[];
	journal: string;
	medium: string;
	content: string;
	coverImage?: string;
}

interface D1Result<T> {
	results: T[];
	success: boolean;
	meta?: unknown;
}

export interface ArticleLink {
	id: string;
	day: string;
	month: string;
	title: string;
	article: {
		content: string;
		metadata: {
			title: string;
			author: string;
			publishDate: Date;
			tags: string[];
			journal: string;
			medium: string;
		};
	};
}

interface ArticleRow {
	id: string;
	title: string;
	publish_date: string;
	content_hash: string;
	author: string;
	journal: string;
	medium: string;
	tags: string | null;
	cover_image: string;
}

export async function getDB(): Promise<D1Database> {
	const env = (await getCloudflareContext()).env as Env;
	const db = env.DB as unknown as D1Database;
	if (!db) {
		throw new Error("Database not found in environment");
	}
	return db;
}

export async function getR2(): Promise<R2Bucket> {
	const env = (await getCloudflareContext()).env as Env;
	const r2 = env.posts as unknown as R2Bucket;
	if (!r2) {
		throw new Error("Database not found in environment");
	}
	return r2;
}

export async function getMetadataTypes(): Promise<MetadataTypes> {
	const db = await getDB();

	try {
		// Fetch all metadata types in parallel with proper typing
		const [authors, journals, mediums, tags] = await Promise.all([
			db
				.prepare("SELECT name, slug FROM authors ORDER BY name")
				.all() as Promise<D1Result<DBMetadataItem>>,
			db
				.prepare("SELECT name, slug FROM journals ORDER BY name")
				.all() as Promise<D1Result<DBMetadataItem>>,
			db
				.prepare("SELECT name, slug FROM mediums ORDER BY name")
				.all() as Promise<D1Result<DBMetadataItem>>,
			db.prepare("SELECT name, slug FROM tags ORDER BY name").all() as Promise<
				D1Result<DBMetadataItem>
			>,
		]);

		// Format the results to match the combo box format
		return {
			authors: authors.results.map((author) => ({
				label: author.name,
				value: author.slug,
			})),
			journals: journals.results.map((journal) => ({
				label: journal.name,
				value: journal.slug,
			})),
			mediums: mediums.results.map((medium) => ({
				label: medium.name,
				value: medium.slug,
			})),
			tags: tags.results.map((tag) => ({
				label: tag.name,
				value: tag.slug,
			})),
		};
	} catch (error) {
		console.error("Error fetching metadata:", error);
		// Return empty arrays if there's an error
		return {
			authors: [],
			journals: [],
			mediums: [],
			tags: [],
		};
	}
}

export async function saveArticle(
	articleData: SaveArticleRequest,
): Promise<string> {
	const db = await getDB();
	const articleId = crypto.randomUUID();

	try {
		// First save content to R2
		await saveArticleR2({
			key: articleId,
			article: articleData.content,
		});

		// Now save metadata and relationships in D1
		const result = await db.batch([
			// 1. Get or create author
			db
				.prepare(`
        INSERT INTO authors (name, slug) 
        VALUES (?, ?) 
        ON CONFLICT (slug) DO UPDATE SET name = ? 
        RETURNING id
      `)
				.bind(
					articleData.author,
					articleData.author.toLowerCase().replace(/\s+/g, "-"),
					articleData.author,
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
					articleData.journal,
					articleData.journal.toLowerCase().replace(/\s+/g, "-"),
					articleData.journal,
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
					articleData.medium,
					articleData.medium.toLowerCase().replace(/\s+/g, "-"),
					articleData.medium,
				),

			// 4. Insert or update tags and get their IDs
			...articleData.tags.map((tag) =>
				db
					.prepare(`
          INSERT INTO tags (name, slug) 
          VALUES (?, ?) 
          ON CONFLICT (slug) DO UPDATE SET name = ? 
          RETURNING id
        `)
					.bind(tag, tag.toLowerCase().replace(/\s+/g, "-"), tag),
			),
		]);

		// Extract IDs from results
		const [authorResult, journalResult, mediumResult, ...tagResults] =
			result as D1Result<{ id: number }>[];

		// Insert the article metadata
		await db
			.prepare(`
      INSERT INTO articles (
        id,
        title, 
        author_id, 
        journal_id, 
        medium_id, 
        publish_date,
        content_hash,
        cover_image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
			.bind(
				articleId,
				articleData.title,
				authorResult.results[0].id,
				journalResult.results[0].id,
				mediumResult.results[0].id,
				new Date(articleData.publishDate).toISOString(),
				articleId, // Using the same UUID as R2 key
				articleData.coverImage,
			)
			.run();

		// Insert article-tag relationships
		if (tagResults.length > 0) {
			await db.batch(
				tagResults.map((tagResult) =>
					db
						.prepare(
							"INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)",
						)
						.bind(articleId, tagResult.results[0].id),
				),
			);
		}
		revalidateTag("articles");
		return articleId;
	} catch (error) {
		console.error("Error saving article:", error);
		throw new Error("Failed to save article");
	}
}

export async function saveArticleR2({
	key,
	article,
}: { key: string; article: string }) {
	const r2 = await getR2();
	await r2.put(key, article);
	return;
}

export const getArticleLinks = unstable_cache(
	async () => {
		const db = await getDB();
		try {
			const result = (await db
				.prepare(`
        SELECT 
          a.id,
          a.title,
          a.publish_date,
          a.content_hash,
          a.cover_image,
          au.name as author,
          j.name as journal,
          m.name as medium,
          GROUP_CONCAT(t.name) as tags
        FROM articles a
        JOIN authors au ON a.author_id = au.id
        JOIN journals j ON a.journal_id = j.id
        JOIN mediums m ON a.medium_id = m.id
        LEFT JOIN article_tags at ON a.id = at.article_id
        LEFT JOIN tags t ON at.tag_id = t.id
        GROUP BY a.id
        ORDER BY a.publish_date DESC
      `)
				.all()) as D1Result<ArticleRow>;

			const r2 = await getR2();
			const articleLinks: Article[] = await Promise.all(
				result.results.map(async (row: ArticleRow) => {
					const publishDate = new Date(row.publish_date);
					const content = await r2.get(row.content_hash);
					const articleContent = content ? await content.text() : "";
					return {
						id: row.id,
						title: row.title,
						author: row.author,
						journal: row.journal,
						medium: row.medium,
						publishDate: publishDate,
						tags: row.tags ? row.tags.split(",") : [],
						content: articleContent,
						coverImage: row.cover_image || "", // Provide a default empty string if no cover image
					};
				}),
			);
			return articleLinks;
		} catch (error) {
			console.error("Error fetching articles:", error);
			throw new Error("Failed to fetch articles");
		}
	},
	["articles-list"],
	{
		revalidate: 60,
		tags: ["articles"],
	},
);

// const cf = await getCloudflareContext();
// const env = cf.env as unknown as Env;

export async function uploadImage({ formData }: { formData: FormData }) {
	try {
		const response = await fetch(
			// "https://liamt:sm00thie@active-chapter.liamtsang.workers.dev/api/images/upload",
			"/api/images/upload",
			{
				method: "PUT",
				headers: {
					Authorization: `Basic ${btoa("liamt:sm00thie")}`,
				},
				body: formData,
			},
		);

		if (!response.ok) {
			throw new Error(`Upload failed: ${response.statusText}`);
		}

		const key = await response.text();
		// Return the URL to access the image
		return `https://active-chapter.liamtsang.workers.dev/api/images/${key}`;
	} catch (error) {
		console.error("Upload error:", error);
		throw error;
	}
}

// Utility function to slugify strings
// function slugify(text: string): string {
// 	return text
// 		.toLowerCase()
// 		.replace(/\s+/g, "-")
// 		.replace(/[^\w\-]+/g, "")
// 		.replace(/\-\-+/g, "-")
// 		.replace(/^-+/, "")
// 		.replace(/-+$/, "");
// }

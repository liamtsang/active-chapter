import type { Article, ArticleFilters } from "@/types";
import type { D1Database } from "@cloudflare/workers-types";

interface MetadataItem {
	id: number;
	name: string;
	slug: string;
}

interface D1MetadataResult {
	results: MetadataItem[];
	success: boolean;
	meta: {
		duration: number;
		rows_read: number;
		rows_written: number;
	};
}

// This helper ensures we don't create multiple instances of the db
export function getDB(): D1Database {
	const db = process.env.DB as unknown as D1Database;

	if (!db) {
		throw new Error("Database not found in environment");
	}

	return db;
}

export async function getMetadataTypes(db: D1Database) {
	// Fetch all metadata types in parallel
	const [authors, journals, mediums, tags] = await Promise.all([
		db.prepare("SELECT name, slug FROM authors ORDER BY name").all(),
		db.prepare("SELECT name, slug FROM journals ORDER BY name").all(),
		db.prepare("SELECT name, slug FROM mediums ORDER BY name").all(),
		db.prepare("SELECT name, slug FROM tags ORDER BY name").all(),
	]);

	// Format the results to match the component's expected structure
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
}

export async function saveArticle(article: Article, db: D1Database) {
	const { title, author, journal, medium, publishDate, tags, content } =
		article;

	// Start a transaction
	return await db
		.batch([
			// 1. Insert or get author
			db
				.prepare(
					`INSERT INTO authors (name, slug) 
       VALUES (?, ?) 
       ON CONFLICT (slug) DO UPDATE SET name = ? 
       RETURNING id`,
				)
				.bind(author, slugify(author), author),

			// 2. Insert or get journal
			db
				.prepare(
					`INSERT INTO journals (name, slug) 
       VALUES (?, ?) 
       ON CONFLICT (slug) DO UPDATE SET name = ? 
       RETURNING id`,
				)
				.bind(journal, slugify(journal), journal),

			// 3. Insert or get medium
			db
				.prepare(
					`INSERT INTO mediums (name, slug) 
       VALUES (?, ?) 
       ON CONFLICT (slug) DO UPDATE SET name = ? 
       RETURNING id`,
				)
				.bind(medium, slugify(medium), medium),

			// 4. Insert tags and get their IDs
			...tags.map((tag) =>
				db
					.prepare(
						`INSERT INTO tags (name, slug) 
         VALUES (?, ?) 
         ON CONFLICT (slug) DO UPDATE SET name = ? 
         RETURNING id`,
					)
					.bind(tag, slugify(tag), tag),
			),
		])
		.then(
			async ([
				authorResult,
				journalResult,
				mediumResult,
				...tagResults
			]: D1Result[]) => {
				// Insert the article
				const articleResult = await db
					.prepare(`
      INSERT INTO articles (
        title, author_id, journal_id, medium_id, 
        publish_date, content
      ) VALUES (?, ?, ?, ?, ?, ?)
      RETURNING id
    `)
					.bind(
						title,
						authorResult.results[0].id,
						journalResult.results[0].id,
						mediumResult.results[0].id,
						publishDate.toISOString(),
						content,
					)
					.run();

				// Insert article-tag relationships
				const articleId = articleResult.results[0].id;
				await db.batch(
					tagResults.map((tagResult) =>
						db
							.prepare(
								`INSERT INTO article_tags (article_id, tag_id) 
           VALUES (?, ?)`,
							)
							.bind(articleId, tagResult.results[0].id),
					),
				);

				return articleId;
			},
		);
}

export async function getArticles(
	db: D1Database,
	filters: ArticleFilters = {},
	page = 1,
	pageSize = 10,
) {
	let query = `
    SELECT 
      a.id,
      a.title,
      a.publish_date,
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
  `;

	const conditions: string[] = [];
	const params: unknown[] = [];

	if (filters.author) {
		conditions.push("au.slug = ?");
		params.push(slugify(filters.author));
	}

	if (filters.journal) {
		conditions.push("j.slug = ?");
		params.push(slugify(filters.journal));
	}

	if (filters.medium) {
		conditions.push("m.slug = ?");
		params.push(slugify(filters.medium));
	}

	if (filters.tags?.length) {
		conditions.push(`
      a.id IN (
        SELECT article_id 
        FROM article_tags 
        JOIN tags ON article_tags.tag_id = tags.id 
        WHERE tags.slug IN (${filters.tags.map(() => "?").join(",")})
        GROUP BY article_id 
        HAVING COUNT(DISTINCT tags.id) = ?
      )
    `);
		params.push(...filters.tags.map(slugify), filters.tags.length);
	}

	if (filters.startDate) {
		conditions.push("a.publish_date >= ?");
		params.push(filters.startDate.toISOString());
	}

	if (filters.endDate) {
		conditions.push("a.publish_date <= ?");
		params.push(filters.endDate.toISOString());
	}

	if (conditions.length > 0) {
		query += ` WHERE ${conditions.join(" AND ")}`;
	}

	query += `
    GROUP BY a.id
    ORDER BY a.publish_date DESC
    LIMIT ? OFFSET ?
  `;

	params.push(pageSize, (page - 1) * pageSize);

	const result = await db
		.prepare(query)
		.bind(...params)
		.all();

	return result.results.map((row) => ({
		...row,
		tags: row.tags ? row.tags.split(",") : [],
		publish_date: new Date(row.publish_date),
	}));
}

// Utility function to create URL-friendly slugs
function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^\w\-]+/g, "")
		.replace(/\-\-+/g, "-")
		.replace(/^-+/, "")
		.replace(/-+$/, "");
}

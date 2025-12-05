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
        value: author.name,
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
        .prepare(
          `
        INSERT INTO authors (name, slug)
        VALUES (?, ?)
        ON CONFLICT (slug) DO UPDATE SET name = ?
        RETURNING id
      `,
        )
        .bind(
          articleData.author,
          articleData.author.toLowerCase().replace(/\s+/g, "-"),
          articleData.author,
        ),

      // 2. Get or create journal
      db
        .prepare(
          `
        INSERT INTO journals (name, slug)
        VALUES (?, ?)
        ON CONFLICT (slug) DO UPDATE SET name = ?
        RETURNING id
      `,
        )
        .bind(
          articleData.journal,
          articleData.journal.toLowerCase().replace(/\s+/g, "-"),
          articleData.journal,
        ),

      // 3. Get or create medium
      db
        .prepare(
          `
        INSERT INTO mediums (name, slug)
        VALUES (?, ?)
        ON CONFLICT (slug) DO UPDATE SET name = ?
        RETURNING id
      `,
        )
        .bind(
          articleData.medium,
          articleData.medium.toLowerCase().replace(/\s+/g, "-"),
          articleData.medium,
        ),

      // 4. Insert or update tags and get their IDs
      ...articleData.tags.map((tag) =>
        db
          .prepare(
            `
          INSERT INTO tags (name, slug)
          VALUES (?, ?)
          ON CONFLICT (slug) DO UPDATE SET name = ?
          RETURNING id
        `,
          )
          .bind(tag, tag.toLowerCase().replace(/\s+/g, "-"), tag),
      ),
    ]);

    // Extract IDs from results
    const [authorResult, journalResult, mediumResult, ...tagResults] =
      result as D1Result<{ id: number }>[];

    // Insert the article metadata
    await db
      .prepare(
        `
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
    `,
      )
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
}: {
  key: string;
  article: string;
}) {
  const r2 = await getR2();
  await r2.put(key, article);
  return;
}

// Non-cached version for admin pages
async function fetchArticleLinks(): Promise<Article[]> {
  const db = await getDB();
  try {
    const result = (await db
      .prepare(
        `
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
      `,
      )
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
          coverImage: row.cover_image || "",
        };
      }),
    );
    return articleLinks;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw new Error("Failed to fetch articles");
  }
}

// Fresh fetch for admin - no caching
export async function getArticleLinksFresh(): Promise<Article[]> {
  return fetchArticleLinks();
}

// Cached version for public pages
export const getArticleLinks = unstable_cache(
  fetchArticleLinks,
  ["articles-list"],
  {
    revalidate: 300, // 5 minutes for ISR
    tags: ["articles"],
  },
);

export async function getArticlesByTitle(title: string) {
  const db = await getDB();
  try {
    const result = (await db
      .prepare(
        `
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
      WHERE a.title LIKE ?
      GROUP BY a.id
      ORDER BY a.publish_date DESC
    `,
      )
      .bind(`%${title}%`)
      .all()) as D1Result<ArticleRow>;

    const r2 = await getR2();

    const articles = await Promise.all(
      result.results.map(async (row) => {
        const content = await r2.get(row.content_hash);
        const articleContent = content ? await content.text() : "";

        return {
          id: row.id,
          title: row.title,
          author: row.author,
          journal: row.journal,
          medium: row.medium,
          publishDate: new Date(row.publish_date),
          tags: row.tags ? row.tags.split(",") : [],
          content: articleContent,
          coverImage: row.cover_image || "",
        };
      }),
    );

    return articles;
  } catch (error) {
    console.error("Error fetching articles by title:", error);
    throw new Error("Failed to fetch articles");
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  const db = await getDB();
  const r2 = await getR2();

  try {
    const result = (await db
      .prepare(
        `
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
        WHERE a.id = ?
        GROUP BY a.id
      `,
      )
      .bind(id)
      .first()) as ArticleRow | null;

    if (!result) return null;

    const content = await r2.get(result.content_hash);
    const articleContent = content ? await content.text() : "";

    return {
      id: result.id,
      title: result.title,
      author: result.author,
      journal: result.journal,
      medium: result.medium,
      publishDate: new Date(result.publish_date),
      tags: result.tags ? result.tags.split(",") : [],
      content: articleContent,
      coverImage: result.cover_image || "",
    };
  } catch (error) {
    console.error("Error fetching article by ID:", error);
    return null;
  }
}

export async function updateArticle(
  id: string,
  articleData: SaveArticleRequest,
): Promise<string> {
  const db = await getDB();

  try {
    // Update content in R2
    await saveArticleR2({
      key: id,
      article: articleData.content,
    });

    // Get or create author, journal, medium
    const result = await db.batch([
      db
        .prepare(
          `
        INSERT INTO authors (name, slug)
        VALUES (?, ?)
        ON CONFLICT (slug) DO UPDATE SET name = ?
        RETURNING id
      `,
        )
        .bind(
          articleData.author,
          articleData.author.toLowerCase().replace(/\s+/g, "-"),
          articleData.author,
        ),

      db
        .prepare(
          `
        INSERT INTO journals (name, slug)
        VALUES (?, ?)
        ON CONFLICT (slug) DO UPDATE SET name = ?
        RETURNING id
      `,
        )
        .bind(
          articleData.journal,
          articleData.journal.toLowerCase().replace(/\s+/g, "-"),
          articleData.journal,
        ),

      db
        .prepare(
          `
        INSERT INTO mediums (name, slug)
        VALUES (?, ?)
        ON CONFLICT (slug) DO UPDATE SET name = ?
        RETURNING id
      `,
        )
        .bind(
          articleData.medium,
          articleData.medium.toLowerCase().replace(/\s+/g, "-"),
          articleData.medium,
        ),

      ...articleData.tags.map((tag) =>
        db
          .prepare(
            `
          INSERT INTO tags (name, slug)
          VALUES (?, ?)
          ON CONFLICT (slug) DO UPDATE SET name = ?
          RETURNING id
        `,
          )
          .bind(tag, tag.toLowerCase().replace(/\s+/g, "-"), tag),
      ),
    ]);

    const [authorResult, journalResult, mediumResult, ...tagResults] =
      result as D1Result<{ id: number }>[];

    // Update the article metadata
    await db
      .prepare(
        `
      UPDATE articles SET
        title = ?,
        author_id = ?,
        journal_id = ?,
        medium_id = ?,
        publish_date = ?,
        cover_image = ?
      WHERE id = ?
    `,
      )
      .bind(
        articleData.title,
        authorResult.results[0].id,
        journalResult.results[0].id,
        mediumResult.results[0].id,
        new Date(articleData.publishDate).toISOString(),
        articleData.coverImage,
        id,
      )
      .run();

    // Delete existing tag relationships and insert new ones
    await db
      .prepare("DELETE FROM article_tags WHERE article_id = ?")
      .bind(id)
      .run();

    if (tagResults.length > 0) {
      await db.batch(
        tagResults.map((tagResult) =>
          db
            .prepare(
              "INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)",
            )
            .bind(id, tagResult.results[0].id),
        ),
      );
    }

    revalidateTag("articles");
    return id;
  } catch (error) {
    console.error("Error updating article:", error);
    throw new Error("Failed to update article");
  }
}

export async function deleteArticle(id: string) {
  const db = await getDB();
  const r2 = await getR2();

  try {
    // Get article info to delete from R2
    const article = await db
      .prepare(
        `
      SELECT content_hash, cover_image FROM articles WHERE id = ?
    `,
      )
      .bind(id)
      .first();

    if (!article) throw new Error("Article not found");

    // Delete from R2
    if (article.content_hash) {
      await r2.delete(article.content_hash as string);
    }
    if (article.cover_image) {
      await r2.delete(article.cover_image as string);
    }

    // Delete from D1
    await db.batch([
      db.prepare("DELETE FROM article_tags WHERE article_id = ?").bind(id),
      db.prepare("DELETE FROM articles WHERE id = ?").bind(id),
    ]);

    revalidateTag("articles");
    return true;
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
}

// const cf = await getCloudflareContext();
// const env = cf.env as unknown as Env;

export async function uploadImage({ formData }: { formData: FormData }) {
  try {
    const response = await fetch(
      "https://activechapter.online/api/images/upload",
      // "/api/images/upload",
      {
        method: "PUT",
        headers: {
          Authorization: `Basic ${btoa("active:chapter")}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const key = await response.text();
    // Return the URL to access the image
    return `https://active:chapter@activechapter.online/api/images/${key}`;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

// Popup content functions
export async function getPopupContent(): Promise<string> {
  const db = await getDB();
  try {
    const result = (await db
      .prepare("SELECT setting_value FROM site_settings WHERE setting_key = ?")
      .bind("popup_content")
      .first()) as { setting_value: string } | null;

    return result?.setting_value || "<p>Welcome to Active Chapter! 🌎️</p>";
  } catch (error) {
    console.error("Error fetching popup content:", error);
    return "<p>Welcome to Active Chapter! 🌎️</p>";
  }
}

export async function savePopupContent(content: string): Promise<void> {
  const db = await getDB();
  try {
    await db
      .prepare(
        `
				INSERT INTO site_settings (setting_key, setting_value)
				VALUES (?, ?)
				ON CONFLICT (setting_key)
				DO UPDATE SET setting_value = ?, updated_at = CURRENT_TIMESTAMP
			`,
      )
      .bind("popup_content", content, content)
      .run();
  } catch (error) {
    console.error("Error saving popup content:", error);
    throw new Error("Failed to save popup content");
  }
}

// About content functions
export async function getAboutContent(): Promise<string> {
  const db = await getDB();

  // Default content matching the current About component
  const defaultContent = `<section class="space-y-8 p-4 pb-32">
		<h2 class="text-xl/5 md:text-3xl font-medium">Active Chapter</h2>
		<h3 class="text-sm/5 md:text-base/5 xl:text-lg/7 font-instrument font-medium italic">
			We are a publishing and art collective, and we like you and we love you
			and we need you.
		</h3>
		<div
			id="body-text"
			class="max-w-[65ch] font-instrument text-sm/5 md:text-base/5 xl:text-lg/7 indent-8 space-y-2"
		>
			<p>
				We believe in community through friendship, and knowledge through
				community. We publish words not only in print, but on everyday and
				fine art objects. We hope to proliferate theory, cultural mythologies,
				and the work of emerging/underrepresented writers––areas especially
				important to us as queer artists of color. We want words in your
				kitchen and your bathroom and your car (if you have one) and on your
				body and head and feet (if you have them).
			</p>
			<p>
				Active Chapter was founded in 2024 by artists Eka Savajol, Lucia
				Mumma, Max Chu, and XY Zhou. Our intern is Jojo Savajol. Web design by
				Liam Tsang.
			</p>
			<p>
				Our current project is In the Mood for Love, as a part of What Can We
				Do? artist grant received from Asian American Arts Alliance. We are
				working with people living in Chinatown, New York to collect their
				stories and perspectives themed around love. Stay tuned.
			</p>
			<p>
				Get in touch!{" "}
				<a
					class="underline"
					href="mailto:activechapterpublishing@gmail.com"
					target="_blank"
				>
					activechapterpublishing@gmail.com
				</a>
			</p>
		</div>
		<div>
			<h3 class="pb-2 text-sm/5 md:text-base/5 xl:text-lg/7 font-instrument font-medium italic">
				Markets & Stockists
			</h3>
			<ul class="text-sm/5 md:text-base/5 xl:text-lg/7">
				<li>2025-Present Dreamers Coffee House, New York, NY</li>
				<li>2025-Present Human Relations, Brooklyn, NY</li>
				<li>2025-Present Hive Mind Books, Brooklyn, NY</li>
				<li>2025 Everything Must Go , Rash, Brooklyn, NY</li>
				<li>2024 Trans Art Bazaar, Brooklyn, NY</li>
				<li>2024 Furuba Market, Brooklyn, NY</li>
				<li>2023 am:pm gallery, Brooklyn, NY</li>
			</ul>
		</div>
		<div>
			<h3 class="pb-2 text-sm/5 md:text-base/5 xl:text-lg/7 font-instrument font-medium italic">
				Grants & Awards
			</h3>
			<ul class="text-sm/5 md:text-base/5 xl:text-lg/7">
				<li>
					2025 What Can We Do? Artist Grant, Asian American Arts Alliance
				</li>
			</ul>
		</div>
		<img
			alt="Photo of active chapter members"
			class="outline outline-black outline-[1px]"
			width="400"
			height="200"
			src="/about.jpeg"
			loading="lazy"
			decoding="async"
		/>
	</section>`;

  try {
    const result = (await db
      .prepare("SELECT setting_value FROM site_settings WHERE setting_key = ?")
      .bind("about_content")
      .first()) as { setting_value: string } | null;

    return result?.setting_value || defaultContent;
  } catch (error) {
    console.error("Error fetching about content:", error);
    return defaultContent;
  }
}

export async function saveAboutContent(content: string): Promise<void> {
  const db = await getDB();
  try {
    await db
      .prepare(
        `
				INSERT INTO site_settings (setting_key, setting_value)
				VALUES (?, ?)
				ON CONFLICT (setting_key)
				DO UPDATE SET setting_value = ?, updated_at = CURRENT_TIMESTAMP
			`,
      )
      .bind("about_content", content, content)
      .run();
  } catch (error) {
    console.error("Error saving about content:", error);
    throw new Error("Failed to save about content");
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

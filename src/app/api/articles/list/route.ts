import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { unstable_cache } from "next/cache";

interface ArticleMetadata {
  id: string;
  title: string;
  author: string;
  journal: string;
  medium: string;
  publishDate: Date;
  tags: string[];
  coverImage: string;
}

interface ArticleRow {
  id: string;
  title: string;
  publish_date: string;
  cover_image: string;
  author: string;
  journal: string;
  medium: string;
  tags: string | null;
}

const getArticlesMetadata = async (): Promise<ArticleMetadata[]> => {
  const db = await getDB();
  try {
    const result = await db
      .prepare(`
        SELECT 
          a.id,
          a.title,
          a.publish_date,
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
      .all() as { results: ArticleRow[] };

    return result.results.map((row) => ({
      id: row.id,
      title: row.title,
      author: row.author,
      journal: row.journal,
      medium: row.medium,
      publishDate: new Date(row.publish_date),
      tags: row.tags ? row.tags.split(",") : [],
      coverImage: row.cover_image || "",
    }));
  } catch (error) {
    console.error("Error fetching articles metadata:", error);
    throw new Error("Failed to fetch articles metadata");
  }
};

const getCachedArticlesMetadata = unstable_cache(
  getArticlesMetadata,
  ["articles-metadata"],
  {
    revalidate: 300, // 5 minutes - longer cache for ISR
    tags: ["articles"],
  }
);

export async function GET() {
  try {
    const articles = await getCachedArticlesMetadata();
    return NextResponse.json(articles, {
      headers: {
        // ISR headers
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error("Error fetching articles metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles metadata" },
      { status: 500 }
    );
  }
}
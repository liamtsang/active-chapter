"use server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { D1Database } from "@cloudflare/workers-types";

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

interface D1Result<T> {
	results: T[];
	success: boolean;
	meta?: unknown;
}

interface Env {
	NEXTJS_ENV: string;
	DB: D1Database;
	ASSETS: Fetcher;
}

export async function getDB(): Promise<D1Database> {
	const env = (await getCloudflareContext()).env as Env;
	const db = env.DB as unknown as D1Database;
	if (!db) {
		throw new Error("Database not found in environment");
	}
	return db;
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

"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { ArticleLink } from "./ArticleLink";
import { getArticleLinks } from "@/lib/db";
import type { Article } from "@/types";
import type { Filters } from "@/app/page";

// Separate the data fetching logic into its own component
function ArticlesContent({
	toggleArticle,
	filters,
}: {
	toggleArticle: (article: Article) => void;
	filters: Filters;
}) {
	const [articles, setArticles] = useState<Article[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const filteredArticles = useMemo(() => {
		if (!filters) return articles;
		return articles.filter((article) => {
			const authorMatch =
				filters.authors.length === 0 ||
				filters.authors.includes(article.author);
			const journalMatch =
				filters.journals.length === 0 ||
				filters.journals.includes(article.journal);
			const mediumMatch =
				filters.mediums.length === 0 ||
				filters.mediums.includes(article.medium);
			const tagMatch =
				filters.tags.length === 0 ||
				article.tags.some((tag) => filters.tags.includes(tag));
			return authorMatch && journalMatch && mediumMatch && tagMatch;
		});
	}, [filters, articles]);

	useEffect(() => {
		let mounted = true;

		async function loadArticles() {
			try {
				const fetchedArticles = await getArticleLinks();
				if (mounted) {
					setArticles(fetchedArticles);
				}
			} catch (err) {
				if (mounted) {
					setError("Failed to load articles");
					console.error(err);
				}
			} finally {
				if (mounted) {
					setIsLoading(false);
				}
			}
		}

		loadArticles();

		return () => {
			mounted = false;
		};
	}, []);

	if (isLoading) {
		return <div>Loading articles...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="space-y-0">
			{filteredArticles.length === 0 && (
				<div>No posts matching those filters..</div>
			)}
			{filteredArticles.map((article) => (
				<ArticleLink
					key={article.id}
					day={new Date(article.publishDate)
						.getDate()
						.toString()
						.padStart(2, "0")}
					month={new Date(article.publishDate)
						.toLocaleString("en-US", { month: "short" })
						.toUpperCase()}
					title={article.title}
					article={{
						id: article.id,
						title: article.title,
						author: article.author,
						journal: article.journal,
						medium: article.medium,
						publishDate: article.publishDate,
						tags: article.tags,
						coverImage: article.coverImage || "",
					}}
					toggleArticle={(articleMetadata) => {
						const fullArticle: Article = {
							...articleMetadata,
							content: article.content,
						};
						toggleArticle(fullArticle);
					}}
				/>
			))}
		</div>
	);
}

// Wrapper component that provides Suspense boundary
export default function ArticlesList({
	toggleArticle,
	filters,
}: {
	toggleArticle: (article: Article) => void;
	filters: Filters;
}) {
	return (
		<Suspense fallback={<div>Loading articles...</div>}>
			<ArticlesContent toggleArticle={toggleArticle} filters={filters} />
		</Suspense>
	);
}

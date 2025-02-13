import { motion, AnimatePresence } from "motion/react";
import type { ColumnState, Article, Action } from "@/types";
import {
	homeColumnVariants,
	articleColumnVariants,
	shopColumnVariants,
	aboutColumnVariants,
} from "@/components/animations";
import { ArticleLink } from "./ArticleLink";
import { SelectedArticle } from "./SelectedArticle";
import { Shop } from "./Shop";
import { About } from "./About";
import { useState, useEffect, useMemo } from "react";
import { getArticleLinks } from "@/lib/db";
import type { Filters } from "@/app/page";

type MainProps = {
	columnState?: ColumnState;
	toggleArticle: (article: Article) => void;
	dispatch: (value: Action) => void;
	onColumnHover: (column: string | null) => void;
	filters: Filters;
};

export const Main = ({
	columnState,
	toggleArticle,
	dispatch,
	onColumnHover,
	filters,
}: MainProps) => {
	return (
		<motion.main
			layout="preserve-aspect"
			transition={{
				duration: 0.3,
				layout: { duration: 0.3 },
			}}
			className=" flex flex-cols outline outline-black outline-[1px] h-full overflow-x-clip"
		>
			<motion.section
				layout="position"
				layoutId="home-main"
				variants={homeColumnVariants}
				animate={columnState?.home.open}
				initial={"third"}
				transition={{
					layout: { duration: 0.3 },
					width: { duration: 0.3 },
				}}
				onClick={() => {
					if (columnState?.home.open === "full") {
						dispatch({ type: "default", article: null });
					} else {
						dispatch({ type: "open-home", article: null });
					}
				}}
				onMouseEnter={() => onColumnHover("home")}
				onMouseLeave={() => onColumnHover(null)}
				className={`${columnState?.home.open === "full" ? "cursor-w-resize" : "cursor-e-resize"} z-[2] overflow-x-hidden font-space bg-white outline outline-black outline-[1px] h-dvh`}
			>
				<motion.ul layout="position" className="cursor-pointer">
					<ArticlesList filters={filters} toggleArticle={toggleArticle} />{" "}
				</motion.ul>
			</motion.section>
			<AnimatePresence mode="popLayout">
				<motion.section
					layout="position"
					layoutId="article-main"
					variants={articleColumnVariants}
					initial={"closed"}
					animate={columnState?.article.open}
					exit={"closed"}
					transition={{
						layout: { duration: 0.3 },
						width: { duration: 0.3 },
					}}
					onClick={() => {
						if (columnState?.article.open === "full") {
							dispatch({
								type: "open-article",
								article: columnState.article.article,
							});
						} else if (columnState?.article.open === "fullMobile") {
							dispatch({ type: "default", article: null });
						} else {
							dispatch({ type: "full-article", article: null });
						}
					}}
					onMouseEnter={() => onColumnHover("article")}
					onMouseLeave={() => onColumnHover(null)}
					className={`${columnState?.article.open === "full" ? "cursor-e-resize" : "cursor-ew-resize"} h-dvh overflow-y-auto relative bg-white outline outline-black outline-[1px] ml-0`}
				>
					{columnState && (
						<SelectedArticle article={columnState.article.article} />
					)}
				</motion.section>
			</AnimatePresence>
			<motion.section
				layout="position"
				layoutId="shop-main"
				variants={shopColumnVariants}
				animate={columnState?.shop.open}
				initial={"third"}
				transition={{
					layout: { duration: 0.3 },
					width: { duration: 0.3 },
				}}
				onClick={() => {
					if (columnState?.shop.open === "full") {
						dispatch({ type: "default", article: null });
					} else {
						dispatch({ type: "open-shop", article: null });
					}
				}}
				onMouseEnter={() => onColumnHover("shop")}
				onMouseLeave={() => onColumnHover(null)}
				className={`${columnState?.shop.open === "full" ? "cursor-ew-resize" : "cursor-ew-resize"} h-dvh overflow-y-auto relative bg-white outline outline-black outline-[1px] pb-32`}
			>
				<Shop />
			</motion.section>
			<motion.section
				layout="position"
				layoutId="about-main"
				variants={aboutColumnVariants}
				animate={columnState?.about.open}
				initial={"third"}
				transition={{
					layout: { duration: 0.3 },
					width: { duration: 0.3 },
				}}
				onClick={() => {
					if (columnState?.about.open === "full") {
						dispatch({ type: "default", article: null });
					} else {
						dispatch({ type: "open-about", article: null });
					}
				}}
				onMouseEnter={() => onColumnHover("about")}
				onMouseLeave={() => onColumnHover(null)}
				className={`${columnState?.about.open === "full" ? "cursor-e-resize" : "cursor-w-resize"} h-dvh overflow-y-auto relative bg-white outline outline-black outline-[1px]`}
			>
				<motion.div layout="position">
					<About />
				</motion.div>
			</motion.section>
		</motion.main>
	);
};

export default function ArticlesList({
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

	// Load articles only once
	useEffect(() => {
		async function loadArticles() {
			try {
				const fetchedArticles = await getArticleLinks();
				setArticles(fetchedArticles);
			} catch (err) {
				setError("Failed to load articles");
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		}
		loadArticles();
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
					article={article}
					toggleArticle={toggleArticle}
				/>
			))}
		</div>
	);
}

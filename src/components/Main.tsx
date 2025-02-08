import { motion, AnimatePresence } from "motion/react";
import type { ColumnState, Action, Article } from "@/types";
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
import { useState, useEffect } from "react";
import { getArticleLinks } from "@/lib/db";

type MainProps = {
	columnState?: ColumnState;
	dispatch: (value: Action) => void;
	toggleArticle: (article: Article) => void;
	onColumnHover: (column: string | null) => void;
};

export const Main = ({
	columnState,
	dispatch,
	toggleArticle,
	onColumnHover,
}: MainProps) => {
	// console.log(dispatch);
	return (
		<motion.main
			layout="preserve-aspect"
			transition={{
				duration: 0.3,
				layout: { duration: 0.3 },
			}}
			className="flex flex-cols outline outline-black outline-[1px] h-full overflow-x-clip"
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
				onMouseEnter={() => onColumnHover("home")}
				onMouseLeave={() => onColumnHover(null)}
				className="z-[2] overflow-x-hidden font-space bg-white outline outline-black outline-[1px] h-dvh"
			>
				<motion.ul layout="position" className="cursor-pointer">
					<ArticlesList toggleArticle={toggleArticle} />{" "}
				</motion.ul>
			</motion.section>
			<AnimatePresence mode="popLayout">
				{(columnState?.article.open === "full" ||
					columnState?.article.open === "expanded" ||
					columnState?.article.open === "fullMobile") && (
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
						onMouseEnter={() => onColumnHover("article")}
						onMouseLeave={() => onColumnHover(null)}
						className="h-dvh overflow-y-auto relative bg-white outline outline-black outline-[1px] ml-auto"
					>
						<SelectedArticle article={columnState.article.article} />
					</motion.section>
				)}
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
				onMouseEnter={() => onColumnHover("shop")}
				onMouseLeave={() => onColumnHover(null)}
				className="h-dvh overflow-y-auto relative bg-white outline outline-black outline-[1px]"
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
				onMouseEnter={() => onColumnHover("about")}
				onMouseLeave={() => onColumnHover(null)}
				className="h-dvh overflow-y-auto relative bg-white outline outline-black outline-[1px]"
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
}: { toggleArticle: (article: Article) => void }) {
	const [articles, setArticles] = useState<Article[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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
			{articles.map((article) => (
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

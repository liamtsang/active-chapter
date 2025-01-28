import { motion, AnimatePresence } from "motion/react";
import type { ColumnState, Action } from "@/types";
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
import type { MDXContent } from "mdx/types";
import sampleArticle from "@/markdown/HOW TO WRITE ABOUT MACHINES.mdx";
import sampleArticleTwo from "@/markdown/welcome.mdx";

type MainProps = {
	columnState?: ColumnState;
	dispatch: (value: Action) => void;
	toggleArticle: (content: MDXContent) => void;
	onColumnHover: (column: string | null) => void;
};

export const Main = ({
	columnState,
	dispatch,
	toggleArticle,
	onColumnHover,
}: MainProps) => {
	console.log(dispatch);
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
				animate={columnState?.home.open ? "open" : "closed"}
				initial={"open"}
				transition={{
					layout: { duration: 0.3 },
					width: { duration: 0.3 },
				}}
				onMouseEnter={() => onColumnHover("home")}
				onMouseLeave={() => onColumnHover(null)}
				className="font-space bg-white outline outline-black outline-[1px] h-dvh"
			>
				<motion.ul layout="position" className="cursor-pointer">
					<ArticleLink
						day="08"
						month="JAN"
						title="WHY MARGINALIZED ART MATTERS"
						article={sampleArticle}
						toggleArticle={toggleArticle}
					/>
					<ArticleLink
						day="12"
						month="DEC"
						title="HOW TO EAT RAMEN"
						article={sampleArticleTwo}
						toggleArticle={toggleArticle}
					/>
				</motion.ul>
			</motion.section>
			<AnimatePresence mode="popLayout">
				{columnState?.article.open && (
					<motion.section
						layout="position"
						layoutId="article-main"
						variants={articleColumnVariants}
						initial={"closed"}
						animate={"open"}
						exit={"closed"}
						transition={{
							layout: { duration: 0.3 },
							width: { duration: 0.3 },
						}}
						onMouseEnter={() => onColumnHover("article")}
						onMouseLeave={() => onColumnHover(null)}
						className="h-dvh overflow-y-auto relative bg-white outline outline-black outline-[1px]"
					>
						<SelectedArticle article={columnState.article.content} />
					</motion.section>
				)}
			</AnimatePresence>
			<motion.section
				layout="position"
				layoutId="shop-main"
				variants={shopColumnVariants}
				animate={columnState?.store.open ? "open" : "closed"}
				initial={"open"}
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
				animate={columnState?.about.open ? "open" : "closed"}
				initial={"open"}
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

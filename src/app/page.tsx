"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const sampleArticle = `
We write and print bespoke artistic publications and make physical objects to sell online. 
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum a iaculis massa. Nulla porta sem ut augue condimentum, eget viverra nisl aliquam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
In vitae quam purus. In cursus, magna vel efficitur mattis, lectus nulla mattis eros, ut tincidunt neque diam sed metus. Proin et consectetur erat. 
Etiam condimentum, nisl non tincidunt porta, quam neque posuere neque, id consequat purus mi vel dolor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras convallis elementum tristique. Sed quis lectus aliquet, ornare enim ut, faucibus augue. 
`;

/* 
Note: Should move away from the layout animations and just do pure width
transforms. Layout animations are weird and sizing and stuff.
*/

const homeColumnVariants = {
	open: {
		width: "calc((1/3)*100%)",
	},
};

const articleColumnVariants = {
	closed: {
		width: "0",
	},
	open: {
		width: "calc(((2/3)*100%))", //32px = 16px * 2
	},
};

const shopColumnVariants = {
	closed: {
		width: "16px",
	},
	open: {
		width: "calc((1/3)*100%)",
	},
};

const aboutColumnVariants = {
	closed: {
		width: "16px",
	},
	open: {
		width: "calc((1/3)*100%)",
	},
};

export default function Home() {
	const [isArticleOpen, setArticleOpen] = useState(false);
	return (
		<motion.main
			transition={{ duration: 0.3 }}
			className="flex flex-cols border-black border-b-[1px] h-full"
			onClick={() => setArticleOpen(!isArticleOpen)}
		>
			<motion.section
				variants={homeColumnVariants}
				animate={isArticleOpen ? "open" : "open"}
				initial={"open"}
				className="bg-white border-black border-r-[1px] h-dvh"
			>
				<ArticleLink date="JAN 08" title="WHY MARGINALIZED ART MATTERS" />
			</motion.section>
			<AnimatePresence>
				{isArticleOpen && (
					<motion.section
						variants={articleColumnVariants}
						initial={"closed"}
						animate={"open"}
						exit={"closed"}
						className="bg-white border-black border-r-[1px]"
					>
						<SelectedArticle article={sampleArticle} />
					</motion.section>
				)}
			</AnimatePresence>
			<motion.section
				variants={shopColumnVariants}
				animate={isArticleOpen ? "closed" : "open"}
				initial={"open"}
				className="bg-white border-black border-r-[1px]"
			>
				SHOP
			</motion.section>
			<motion.section
				variants={aboutColumnVariants}
				animate={isArticleOpen ? "closed" : "open"}
				initial={"open"}
				className="bg-white border-black border-r-[1px]"
			>
				test
			</motion.section>
		</motion.main>
	);
}

const ArticleLink = ({ date, title }: { date: string; title: string }) => (
	<li>
		<div>{date}</div>
		<h2>{title}</h2>
	</li>
);

const SelectedArticle = ({ article }: { article: string }) => (
	<div>{article}</div>
);

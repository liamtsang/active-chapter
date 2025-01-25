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
		width: "62.66667%", //32px = 16px * 2
	},
};

const shopColumnVariants = {
	closed: {
		width: "2%",
	},
	open: {
		width: "calc((1/3)*100%)",
	},
};

const aboutColumnVariants = {
	closed: {
		width: "2%",
	},
	open: {
		width: "calc((1/3)*100%)",
	},
};

/*

STATE THAT NEEDS TO BE TRACKED :
-------------------------------------
|HOME    |ARTICLE |SHOP    |ABOUT   |
-------------------------------------
|open/cl |open/cl |opne/cl |open/cl |  <-- Shared between Header / Main
         |content |                    <-- Selected by HomeUL

|HOME UL         |
|selected article|                     <-- Given to Article

*/

export default function Home() {
	const [isArticleOpen, setArticleOpen] = useState(false);
	return (
		<>
			<Header isArticleOpen={isArticleOpen} setArticleOpen={setArticleOpen} />
			<div className="w-full h-12 border-black border-b-[1px]" />
			<Main isArticleOpen={isArticleOpen} setArticleOpen={setArticleOpen} />
		</>
	);
}

interface MainProps {
	isArticleOpen: boolean;
	setArticleOpen: (value: boolean) => void;
}

const Header = ({ isArticleOpen, setArticleOpen }: MainProps) => {
	return (
		<motion.header
			transition={{ duration: 0.3 }}
			className="font-yantra flex flex-cols border-black border-b-[1px] h-12 overflow-x-hidden"
		>
			<motion.section
				variants={homeColumnVariants}
				animate={isArticleOpen ? "open" : "open"}
				initial={"open"}
				className="pt-1 pl-2 bg-white hover:bg-[#FFFF00] border-black border-r-[1px]"
			>
				Home
			</motion.section>
			<AnimatePresence>
				{isArticleOpen && (
					<motion.section
						variants={articleColumnVariants}
						initial={"closed"}
						animate={"open"}
						exit={"closed"}
						className="pt-1 pl-2 bg-white border-black border-r-[1px]"
					>
						Writings
					</motion.section>
				)}
			</AnimatePresence>
			<motion.section
				variants={shopColumnVariants}
				animate={isArticleOpen ? "closed" : "open"}
				initial={"open"}
				className="pt-1 pl-2 bg-white border-black border-r-[1px]"
			>
				Shop
			</motion.section>
			<motion.section
				variants={aboutColumnVariants}
				animate={isArticleOpen ? "closed" : "open"}
				initial={"open"}
				className="pt-1 pl-2 bg-white border-black border-r-[1px]"
			>
				About
			</motion.section>
		</motion.header>
	);
};

const Main = ({ isArticleOpen, setArticleOpen }: MainProps) => {
	return (
		<motion.main
			transition={{ duration: 0.3 }}
			className="flex flex-cols border-black border-b-[1px] h-full overflow-x-hidden"
		>
			<motion.section
				variants={homeColumnVariants}
				animate={isArticleOpen ? "open" : "open"}
				initial={"open"}
				className="font-yantra bg-white border-black border-r-[1px] h-dvh"
			>
				<ul
					className="cursor-pointer"
					onClick={() => setArticleOpen(!isArticleOpen)}
				>
					<ArticleLink
						day="08"
						month="JAN"
						title="WHY MARGINALIZED ART MATTERS"
					/>
				</ul>
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
				className="h-dvh overflow-y-auto relative bg-white border-black border-r-[1px]"
			>
				<About />
			</motion.section>
		</motion.main>
	);
};

const About = () => {
	return (
		<div className="font-instrument text-xl/6">
			<p>
				We write and print bespoke artistic publications and make physical
				objects to sell online. Lorem ipsum dolor sit amet, consectetur
				adipiscing elit. Vestibulum a iaculis massa. Nulla porta sem ut augue
				condimentum, eget viverra nisl aliquam. Vestibulum ante ipsum primis in
				faucibus orci luctus et ultrices posuere cubilia curae; In vitae quam
				purus. In cursus, magna vel efficitur mattis, lectus nulla mattis eros,
				ut tincidunt neque diam sed metus. Proin et consectetur erat. Etiam
				condimentum, nisl non tincidunt porta, quam neque posuere neque, id
				consequat purus mi vel dolor. Vestibulum ante ipsum primis in faucibus
				orci luctus et ultrices posuere cubilia curae; Class aptent taciti
				sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
				Cras convallis elementum tristique. Sed quis lectus aliquet, ornare enim
				ut, faucibus augue.
			</p>
		</div>
	);
};

const ArticleLink = ({
	day,
	month,
	title,
}: { day: string; month: string; title: string }) => (
	<li className="leading-6 grid grid-cols-[1fr_4fr] border-black border-b-[1px] pl-6 py-2">
		<div>
			<div>{month}</div>
			<div>{day}</div>
		</div>
		<h2>{title} →</h2>
	</li>
);

const SelectedArticle = ({ article }: { article: string }) => (
	<div>{article}</div>
);

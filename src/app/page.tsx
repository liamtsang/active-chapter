"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useReducer } from "react";

const sampleArticle = `
We write and print bespoke artistic publications and make physical objects to sell online. 
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum a iaculis massa. Nulla porta sem ut augue condimentum, eget viverra nisl aliquam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
In vitae quam purus. In cursus, magna vel efficitur mattis, lectus nulla mattis eros, ut tincidunt neque diam sed metus. Proin et consectetur erat. 
Etiam condimentum, nisl non tincidunt porta, quam neque posuere neque, id consequat purus mi vel dolor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras convallis elementum tristique. Sed quis lectus aliquet, ornare enim ut, faucibus augue. 
`;
const sampleArticleTwo = `
Testyy
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
		width: 0,
		minWidth: 0,
	},
	open: {
		width: "calc((2/3)*100% - 48px)",
		minWidth: "auto",
	},
};

const shopColumnVariants = {
	closed: {
		width: "24px",
		minWidth: 0,
	},
	open: {
		width: "calc((1/3)*100%)",
		minWidth: "auto",
	},
};

const aboutColumnVariants = {
	closed: {
		width: "24px",
		minWidth: 0,
	},
	open: {
		width: "calc((1/3)*100%)",
		minWidth: "auto",
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

type ColumnState = {
	home: {
		open: boolean;
	};
	article: {
		open: boolean;
		content: string;
	};
	store: {
		open: boolean;
	};
	about: {
		open: boolean;
	};
};

const initialColumn: ColumnState = {
	home: {
		open: true,
	},
	article: {
		open: false,
		content: "",
	},
	store: {
		open: true,
	},
	about: {
		open: true,
	},
};

type Action = {
	type: string;
	content: string;
};

function columnReducer(columns: ColumnState, action: Action) {
	switch (action.type) {
		case "open-article": {
			return {
				home: {
					open: true,
				},
				article: {
					open: true,
					content: action.content,
				},
				store: {
					open: false,
				},
				about: {
					open: false,
				},
			};
		}
		case "close-article": {
			return {
				home: {
					open: true,
				},
				article: {
					open: false,
					content: "",
				},
				store: {
					open: true,
				},
				about: {
					open: true,
				},
			};
		}
		default:
			return columns;
	}
}

export default function Home() {
	const [columnState, dispatch] = useReducer(columnReducer, initialColumn);

	const toggleArticle = (content: string) => {
		if (columnState.article.open) {
			dispatch({ type: "close-article", content: "" });
		} else if (!columnState.article.open) {
			dispatch({ type: "open-article", content: content });
		}
	};

	return (
		<>
			<Header columnState={columnState} dispatch={dispatch} />
			<div className="w-full h-12 border-black border-b-[1px]" />
			<Main
				columnState={columnState}
				dispatch={dispatch}
				toggleArticle={toggleArticle}
			/>
		</>
	);
}

interface HeaderProps {
	columnState?: ColumnState;
	dispatch: (value: Action) => void;
}

const Header = ({ columnState, dispatch }: HeaderProps) => {
	return (
		<motion.header
			layout
			transition={{
				duration: 0.3,
				layout: { duration: 0.3 },
			}}
			className="font-yantra flex flex-cols outline outline-black outline-[1px] h-12 overflow-x-hidden"
		>
			<motion.section
				layout
				layoutId="home"
				variants={homeColumnVariants}
				animate={columnState?.home.open ? "open" : "closed"}
				initial={"open"}
				transition={{
					layout: { duration: 0.3 },
					width: { duration: 0.3 },
				}}
				className="relative bg-white hover:bg-[#FFFF00] outline outline-black outline-[1px]"
			>
				Home
				<NumberBadge number="1" />
			</motion.section>
			<AnimatePresence mode="popLayout">
				{columnState?.article.open && (
					<motion.section
						layout
						layoutId="article"
						variants={articleColumnVariants}
						initial={"closed"}
						animate={"open"}
						exit={"closed"}
						transition={{
							layout: { duration: 0.3 },
							width: { duration: 0.3 },
						}}
						className="relative bg-white outline outline-black outline-[1px]"
					>
						Writings
						<NumberBadge number="4" />
					</motion.section>
				)}
			</AnimatePresence>
			<motion.section
				layout
				layoutId="shop"
				variants={shopColumnVariants}
				animate={columnState?.store.open ? "open" : "closed"}
				initial={"open"}
				transition={{
					layout: { duration: 0.3 },
					width: { duration: 0.3 },
				}}
				className="relative z-[1] bg-white outline outline-black outline-[1px]"
			>
				Shop
				<NumberBadge number="2" />
			</motion.section>
			<motion.section
				layout
				layoutId="about"
				variants={aboutColumnVariants}
				animate={columnState?.about.open ? "open" : "closed"}
				initial={"open"}
				transition={{
					layout: { duration: 0.3 },
					width: { duration: 0.3 },
				}}
				className="relative z-[1] bg-white outline outline-black outline-[1px]"
			>
				About
				<NumberBadge number="3" />
			</motion.section>
		</motion.header>
	);
};

type MainProps = {
	columnState?: ColumnState;
	dispatch: (value: Action) => void;
	toggleArticle: (content: string) => void;
};

const Main = ({ columnState, dispatch, toggleArticle }: MainProps) => {
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
				className="font-yantra bg-white outline outline-black outline-[1px] h-dvh"
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
						className="z-[-1] bg-white outline outline-black outline-[1px]"
					>
						<motion.div layout="position">
							<SelectedArticle article={columnState.article.content} />
						</motion.div>
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
				className="bg-white outline outline-black outline-[1px]"
			>
				SHOP
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
				className="h-dvh overflow-y-auto relative bg-white outline outline-black outline-[1px]"
			>
				<motion.div layout="position">
					<About />
				</motion.div>
			</motion.section>
		</motion.main>
	);
};

const About = () => {
	return (
		<div className="font-instrument text-xl/6">
			<p>
				We write and print bespoke artistic publications and make physical
				objects to sell online. <br /> Lorem ipsum dolor sit amet, consectetur
				adipiscing elit. Vestibulum a iaculis massa. Nulla porta sem ut augue
				condimentum, eget viverra nisl aliquam. Vestibulum ante ipsum primis in
				faucibus orci luctus et ultrices posuere cubilia curae; In vitae quam
				purus. <br /> In cursus, magna vel efficitur mattis, lectus nulla mattis
				eros, ut tincidunt neque diam sed metus. Proin et consectetur erat.
				Etiam condimentum, nisl non tincidunt porta, quam neque posuere neque,
				id consequat purus mi vel dolor. <br /> Vestibulum ante ipsum primis in
				faucibus orci luctus et ultrices posuere cubilia curae; Class aptent
				taciti sociosqu ad litora torquent per conubia nostra, per inceptos
				himenaeos. Cras convallis elementum tristique. Sed quis lectus aliquet,
				ornare enim ut, faucibus augue.
			</p>
		</div>
	);
};

const ArticleLink = ({
	day,
	month,
	title,
	article,
	toggleArticle,
}: {
	day: string;
	month: string;
	title: string;
	article: string;
	toggleArticle: (content: string) => void;
}) => (
	<li
		onClick={() => toggleArticle(article)}
		className="leading-6 grid grid-cols-[1fr_4fr] border-black border-b-[1px] pl-6 py-2"
	>
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

const NumberBadge = ({ number }: { number: string }) => (
	<div className="absolute right-0 bottom-[-1px] w-[24px] min-w-[24px] h-[24px] min-h-[24px] border border-black border-[1px]">
		<div className="translate-y-[-1px] translate-x-[-1px] flex items-center justify-center w-[24px] min-w-[24px] h-[24px] min-h-[24px] rounded-full border border-black border-[1px]">
			<span className="">{number}</span>
		</div>
	</div>
);

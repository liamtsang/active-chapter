"use client";
import Image from "next/image";
import { motion } from "motion/react";
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

export default function Home() {
	const [isOpen, setOpen] = useState(true);
	return (
		<motion.main
			layout="position"
			transition={{ duration: 0.3 }}
			className="grid border-black border-b-[1px] h-full"
			style={{
				gridTemplateColumns: isOpen ? "1fr 0px 1fr 1fr" : "1fr 2fr 10px 10px",
			}}
			onClick={() => setOpen(!isOpen)}
		>
			<motion.section layout className="bg-white border-black border-r-[1px]">
				<ArticleLink date="JAN 08" title="WHY MARGINALIZED ART MATTERS" />
			</motion.section>
			<motion.section
				layout="position"
				className="bg-white border-black border-r-[1px]"
			>
				<SelectedArticle article={sampleArticle} />
			</motion.section>
			<motion.section
				layout="position"
				className="bg-white border-black border-r-[1px]"
			>
				test
			</motion.section>
			<motion.section
				layout="position"
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

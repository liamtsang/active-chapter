import { motion, AnimatePresence } from "motion/react";
import type { ColumnState, Action } from "@/types";
import {
	homeColumnVariants,
	articleColumnVariants,
	shopColumnVariants,
	aboutColumnVariants,
} from "@/components/animations";
import { NumberBadge } from "@/components/NumberBadge";
import Welcome from "@/markdown/welcome.mdx";

interface HeaderProps {
	columnState?: ColumnState;
	dispatch: (value: Action) => void;
	hoveredColumns: string | null;
}

const getBgColor = (columnName: string, hoveredColumn: string | null) => {
	if (hoveredColumn === columnName) return "bg-[#FFFF00]";
	return "bg-white hover:bg-[#FFFF00]";
};

export const Header = ({
	columnState,
	dispatch,
	hoveredColumns,
}: HeaderProps) => {
	return (
		<motion.header
			layout
			transition={{
				duration: 0.3,
				layout: { duration: 0.3 },
			}}
			className="font-space flex flex-cols text-2xl outline outline-black outline-[1px] h-12 overflow-x-hidden"
		>
			<motion.section
				layout
				layoutId="home"
				variants={homeColumnVariants}
				animate={columnState?.home.open}
				transition={{
					layout: { duration: 0.3 },
					width: { duration: 0.3 },
				}}
				initial={"third"}
				onClick={() => {
					if (columnState?.home.open === "full") {
						dispatch({ type: "default", content: Welcome });
					} else {
						dispatch({ type: "open-home", content: Welcome });
					}
				}}
				className={`${getBgColor("home", hoveredColumns)} cursor-pointer relative outline outline-black outline-[1px] transition-colors duration-200`}
			>
				Home
				<NumberBadge number="1" />
			</motion.section>
			<AnimatePresence mode="popLayout">
				{(columnState?.article.open === "full" ||
					columnState?.article.open === "expanded") && (
					<motion.section
						layout
						layoutId="article"
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
								dispatch({ type: "open-article", content: Welcome });
							} else {
								dispatch({ type: "full-article", content: Welcome });
							}
						}}
						className={`${getBgColor("article", hoveredColumns)} relative outline outline-black outline-[1px] transition-colors duration-200`}
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
				animate={columnState?.shop.open}
				initial={"third"}
				transition={{
					layout: { duration: 0.3 },
					width: { duration: 0.3 },
				}}
				onClick={() => {
					if (columnState?.shop.open === "full") {
						dispatch({ type: "default", content: Welcome });
					} else {
						dispatch({ type: "open-shop", content: Welcome });
					}
				}}
				className={`${getBgColor("shop", hoveredColumns)} cursor-pointer relative outline outline-black outline-[1px] transition-colors duration-200`}
			>
				Shop
				<NumberBadge number="2" />
			</motion.section>
			<motion.section
				layout
				layoutId="about"
				variants={aboutColumnVariants}
				animate={columnState?.about.open}
				initial={"third"}
				transition={{
					layout: { duration: 0.3 },
					width: { duration: 0.3 },
				}}
				onClick={() => {
					if (columnState?.about.open === "full") {
						dispatch({ type: "default", content: Welcome });
					} else {
						dispatch({ type: "open-about", content: Welcome });
					}
				}}
				className={`${getBgColor("about", hoveredColumns)} cursor-pointer relative outline outline-black outline-[1px] transition-colors duration-200`}
			>
				About
				<NumberBadge number="3" />
			</motion.section>
		</motion.header>
	);
};

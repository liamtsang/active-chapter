import { motion, AnimatePresence } from "motion/react";
import type { ColumnState, Action } from "@/types";
import {
	homeColumnVariants,
	articleColumnVariants,
	shopColumnVariants,
	aboutColumnVariants,
} from "@/components/animations";
import { NumberBadge } from "@/components/NumberBadge";

interface HeaderProps {
	columnState?: ColumnState;
	dispatch: (value: Action) => void;
	hoveredColumns: string | null;
}

const getBgColor = (
	columnName: string,
	isOpen: boolean | undefined,
	hoveredColumn: string | null,
) => {
	if (!isOpen) return "bg-white";
	if (hoveredColumn === columnName) return "bg-[#FFFF00]";
	return "bg-white hover:bg-[#FFFF00]";
};

export const Header = ({
	columnState,
	dispatch,
	hoveredColumns,
}: HeaderProps) => {
	console.log(dispatch);
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
				animate={columnState?.home.open ? "open" : "closed"}
				initial={"open"}
				transition={{
					layout: { duration: 0.3 },
					width: { duration: 0.3 },
				}}
				className={`${getBgColor("home", columnState?.home.open, hoveredColumns)} relative outline outline-black outline-[1px] transition-colors duration-200`}
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
						className={`${getBgColor("article", columnState?.article.open, hoveredColumns)} relative outline outline-black outline-[1px] transition-colors duration-200`}
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
				className={`${getBgColor("shop", columnState?.store.open, hoveredColumns)} relative outline outline-black outline-[1px] transition-colors duration-200`}
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
				className={`${getBgColor("about", columnState?.about.open, hoveredColumns)} relative outline outline-black outline-[1px] transition-colors duration-200`}
			>
				About
				<NumberBadge number="3" />
			</motion.section>
		</motion.header>
	);
};

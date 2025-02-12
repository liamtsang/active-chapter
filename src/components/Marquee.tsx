import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { motion, AnimatePresence } from "framer-motion";
import Combobox from "./FilterCombobox";
import type { ColumnState } from "@/types";
import { getMetadataTypes } from "@/lib/db";

const emojiList = [
	"🪨",
	"🌬",
	"🍎",
	"🪳",
	"🥄",
	"🦞",
	"🚪",
	"♉️",
	"🕳️",
	"🪟",
	"❤️‍🩹",
	"🦪",
	"🏳️‍⚧️",
	"🪢",
	"💉",
	"🪣",
	"🐇",
	"🔝",
	"🦷",
	"🗜",
	"🏴‍☠️",
	"🦟",
	"🫨",
	"🪷",
	"🧧",
	"🧃",
	"🫂",
	"☣️",
	"👰🏽‍♂️",
	"🪆",
	"🪕",
	"🫚",
	"🎏",
	"🌀",
	"🌫",
	"🕯️",
	"💌",
	"🐶",
	"🪡",
	"🖇️",
	"🐕",
	"☕️",
	"🐗",
	"🪔",
	"🥛",
	"🫒",
	"✴️",
	"🧦",
	"🌟",
	"💋",
	"🏺",
];

interface Filters {
	authors: string[];
	journals: string[];
	mediums: string[];
	tags: string[];
}

interface MetadataTypes {
	authors: { label: string; value: string }[];
	journals: { label: string; value: string }[];
	mediums: { label: string; value: string }[];
	tags: { label: string; value: string }[];
}

interface MyMarqueeProps {
	columnState: ColumnState;
	filters: Filters;
	setFilters: (filters: Filters) => void;
}

export default function MyMarquee({
	columnState,
	filters,
	setFilters,
}: MyMarqueeProps) {
	const [metadata, setMetadata] = useState<MetadataTypes>({
		authors: [],
		journals: [],
		mediums: [],
		tags: [],
	});

	useEffect(() => {
		getMetadataTypes().then(setMetadata);
	}, []);

	// const clearFilters = () => {
	// 	setFilters({
	// 		authors: [],
	// 		journals: [],
	// 		mediums: [],
	// 		tags: [],
	// 	});
	// };

	const getContentType = () => {
		if (!columnState.home || !columnState.article) return "defaultMarquee";
		if (
			columnState.home.open === "full" ||
			columnState.article.open === "expanded" ||
			columnState.article.open === "full"
		)
			return "filters";
		return "emojiMarquee";
	};

	const contentType = getContentType();

	const transition = {
		duration: 0.15,
	};

	return (
		<AnimatePresence mode="wait">
			{contentType === "filters" && (
				<motion.div
					key="filters"
					initial={{ x: -100, opacity: 1 }}
					animate={{ x: 0, opacity: 1 }}
					exit={{ x: -100, opacity: 0 }}
					transition={transition}
					className="h-12 flex flex-row"
				>
					<Combobox
						label="Authors"
						items={metadata.authors}
						value={filters.authors}
						onChange={(value) =>
							setFilters({ ...filters, authors: value as string[] })
						}
						placeholder="Author"
						color="#000DFF"
						isMulti
					/>
					<Combobox
						label="Tags"
						items={metadata.tags}
						value={filters.tags}
						onChange={(value) =>
							setFilters({ ...filters, tags: value as string[] })
						}
						placeholder="Tags"
						color="#00FF44"
						isMulti
					/>
					<Combobox
						label="Journals"
						items={metadata.journals}
						value={filters.journals}
						onChange={(value) =>
							setFilters({ ...filters, journals: value as string[] })
						}
						placeholder="Journal"
						color="#FF0000"
						isMulti
					/>
					<Combobox
						label="Mediums"
						items={metadata.mediums}
						value={filters.mediums}
						onChange={(value) =>
							setFilters({ ...filters, mediums: value as string[] })
						}
						placeholder="Medium"
						color="#FF00AA"
						isMulti
					/>
				</motion.div>
			)}

			{contentType === "emojiMarquee" && (
				<motion.div
					key="emojiMarquee"
					initial={{ x: 100, opacity: 1 }}
					animate={{ x: 0, opacity: 1 }}
					exit={{ x: 100, opacity: 0 }}
					transition={transition}
					className="min-h-12 h-12"
				>
					<Marquee>
						{emojiList.map((emoji) => (
							<div className="pl-2" key={emoji}>
								{emoji} Active Chapter
							</div>
						))}
					</Marquee>
				</motion.div>
			)}

			{contentType === "defaultMarquee" && (
				<motion.div
					key="defaultMarquee"
					initial={{ x: 100, opacity: 1 }}
					animate={{ x: 0, opacity: 1 }}
					exit={{ x: -100, opacity: 1 }}
					transition={transition}
					className="min-h-12 h-12"
				>
					<Marquee>
						{emojiList.map((emoji) => (
							<div className="pl-2" key={emoji}>
								{emoji} Active Chapter
							</div>
						))}
					</Marquee>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

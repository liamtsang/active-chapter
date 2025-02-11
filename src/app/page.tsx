"use client";
import { Suspense, useReducer, useState } from "react";
import { Header } from "../components/Header";
import { Main } from "../components/Main";
import { columnReducer, initialColumn } from "@/components/columnReducer";
import type { Article } from "@/types";
import { useScreenDetector } from "@/hooks/useScreenDetector";
import Marquee from "@/components/Marquee";
import MyMarquee from "@/components/Marquee";

export interface Filters {
	authors: string[];
	journals: string[];
	mediums: string[];
	tags: string[];
}

export default function Home() {
	const [columnState, dispatch] = useReducer(columnReducer, initialColumn);
	const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
	const [filters, setFilters] = useState<Filters>({
		authors: [],
		journals: [],
		mediums: [],
		tags: [],
	});
	const { isMobile, isTablet, isDesktop } = useScreenDetector();

	const toggleArticle = (article: Article) => {
		if (
			columnState.article.open === "expanded" &&
			article !== columnState.article.article
		) {
			dispatch({ type: "change-article", article });
		} else if (columnState.article.open === "expanded") {
			dispatch({ type: "default", article: null });
		} else if (columnState.article.open === "closed") {
			if (isMobile) {
				dispatch({ type: "open-article-mobile", article });
			} else {
				dispatch({ type: "open-article", article });
			}
		}
	};

	return (
		<>
			<Header
				columnState={columnState}
				dispatch={dispatch}
				hoveredColumns={hoveredColumn}
			/>
			<div className="h-12 min-h-12">
				<MyMarquee
					columnState={columnState}
					filters={filters}
					setFilters={setFilters}
				/>
			</div>
			<Main
				filters={filters}
				columnState={columnState}
				dispatch={dispatch}
				toggleArticle={toggleArticle}
				onColumnHover={setHoveredColumn}
			/>
		</>
	);
}

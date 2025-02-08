"use client";
import { useReducer, useState } from "react";
import { Header } from "../components/Header";
import { Main } from "../components/Main";
import { columnReducer, initialColumn } from "@/components/columnReducer";
import type { Article } from "@/types";
import { useScreenDetector } from "@/hooks/useScreenDetector";

export default function Home() {
	const [columnState, dispatch] = useReducer(columnReducer, initialColumn);
	const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

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
			<div className="w-full h-12 border-black border-b-[1px]" />
			<Main
				columnState={columnState}
				dispatch={dispatch}
				toggleArticle={toggleArticle}
				onColumnHover={setHoveredColumn}
			/>
		</>
	);
}

"use client";
import { useReducer, useState } from "react";
import { Header } from "../components/Header";
import { Main } from "../components/Main";
import { columnReducer, initialColumn } from "@/components/columnReducer";
import type { MDXContent } from "mdx/types";
import Welcome from "@/markdown/welcome.mdx";

export default function Home() {
	const [columnState, dispatch] = useReducer(columnReducer, initialColumn);
	const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

	const toggleArticle = (content: MDXContent) => {
		if (columnState.article.open && content !== columnState.article.content) {
			dispatch({ type: "change-article", content });
		} else if (columnState.article.open) {
			dispatch({ type: "close-article", content: Welcome });
		} else if (!columnState.article.open) {
			dispatch({ type: "open-article", content });
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

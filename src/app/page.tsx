"use client";
import { useEffect, useReducer, useState } from "react";
import { Header } from "../components/Header";
import { Main } from "../components/Main";
import {
	columnReducer,
	getInitialStateFromURL,
	initialColumn,
} from "@/components/columnReducer";
import type { Article } from "@/types";
import { useScreenDetector } from "@/hooks/useScreenDetector";
import MyMarquee from "@/components/Marquee";
import { useSearchParams } from "next/navigation";

export interface Filters {
	authors: string[];
	journals: string[];
	mediums: string[];
	tags: string[];
}

export default function Home() {
	const [columnState, dispatch] = useReducer(columnReducer, {
		...initialColumn,
		...getInitialStateFromURL(), // Needs to be client side for window
	});

	const params = useSearchParams();

	useEffect(() => {
		const article = params.get("article");
		if (!article) return;

		const abortController = new AbortController();

		fetch(`/api/articles/title/${encodeURIComponent(article)}`, {
			signal: abortController.signal,
		})
			.then((res) => res.json())
			.then((article) => {
				if (article) {
					dispatch({
						type: "open-article",
						article: (article as { article: Article[] }).article[0],
					});
				}
			})
			.catch((error) => {
				if (error.name === "AbortError") {
					// Handle abort silently
					return;
				}
				console.error(error);
			});

		return () => {
			abortController.abort();
		};
	}, []);

	const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
	const [filters, setFilters] = useState<Filters>({
		authors: [],
		journals: [],
		mediums: [],
		tags: [],
	});
	const { isMobile } = useScreenDetector();

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

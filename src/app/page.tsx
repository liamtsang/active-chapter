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

	const [keyBuffer, setKeyBuffer] = useState("");
	const targetPhrase = "ilovelucia";
	const bufferTimeout = 5000; // Reset buffer after 2 seconds of no typing
	const [hasMatched, setHasMatched] = useState(false);

	useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout> | null = null;

		if (keyBuffer.toLowerCase().includes(targetPhrase.toLowerCase())) {
			console.log("Lucia I truly love you so much.");
			setTimeout(
				() =>
					console.log(
						"You consistently inspire me to see the beauty in life and you have the most genuine and infectious energy I've seen from someone.",
					),
				1500,
			);
			setTimeout(
				() =>
					console.log(
						"You are so so funny and when I'm with you my face hurts from smiling so much. You are so cute and kind and make me feel like the best I've ever felt about myself.",
					),
				4000,
			);
			setTimeout(
				() =>
					console.log(
						"Ever since I met you I feel like my world has changed, like something finally unlocked.",
					),
				8000,
			);
			setTimeout(
				() =>
					console.log(
						"With you the mundane feels exciting and the exciting feels like a nuclear bomb. I think we are perfect for each other, and I want to share this life with you so badly.  ",
					),
				12000,
			);
			const asciiArt = `       .....           .....
   ,ad8PPPP88b,     ,d88PPPP8ba,
  d8P"      "Y8b, ,d8P"      "Y8b
 dP'           "8a8"           \`Yd
 8(              "              )8
 I8                             8I
  Yb,                         ,dP
   "8a,                     ,a8"
     "8a,                 ,a8"
       "Yba             adP"   Happy Valentines Day
         \`Y8a         a8P'        I love you - Liam
           \`88,     ,88'
             "8b   d8"
              "8b d8"
               \`888'
                 "`;

			setTimeout(() => console.log(asciiArt), 18000);
			setHasMatched(true);
			setTimeout(() => setHasMatched(false), 1500);
		}
		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.key.length === 1) {
				setKeyBuffer((prev) => prev + event.key);

				if (timeoutId) {
					clearTimeout(timeoutId);
				}

				timeoutId = setTimeout(() => {
					setKeyBuffer("");
				}, bufferTimeout);
			}
		};

		window.addEventListener("keypress", handleKeyPress);

		return () => {
			window.removeEventListener("keypress", handleKeyPress);
			if (timeoutId) {
				if (hasMatched) {
					clearTimeout(timeoutId);
				}
				clearTimeout(timeoutId);
			}
		};
	}, [keyBuffer]);

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

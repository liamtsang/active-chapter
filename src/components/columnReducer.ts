import type { ColumnState, Action } from "@/types";
import Welcome from "@/markdown/welcome.mdx";

export const initialColumn: ColumnState = {
	home: { open: "third" },
	article: { open: "closed", content: Welcome },
	shop: { open: "third" },
	about: { open: "third" },
};

export function columnReducer(
	columns: ColumnState,
	action: Action,
): ColumnState {
	switch (action.type) {
		case "default":
			return {
				home: { open: "third" },
				article: { open: "closed", content: columns.article.content },
				shop: { open: "third" },
				about: { open: "third" },
			};
		case "open-article":
			return {
				home: { open: "third" },
				article: { open: "expanded", content: action.content },
				shop: { open: "closed" },
				about: { open: "closed" },
			};
		case "full-article":
			return {
				home: { open: "closed" },
				article: { open: "full", content: columns.article.content },
				shop: { open: "closed" },
				about: { open: "closed" },
			};
		case "change-article":
			return {
				home: { open: "third" },
				article: { open: columns.article.open, content: action.content },
				shop: { open: "closed" },
				about: { open: "closed" },
			};
		case "open-shop":
			return {
				home: { open: "closed" },
				article: { open: "closed", content: columns.article.content },
				shop: { open: "full" },
				about: { open: "closed" },
			};
		case "open-home":
			return {
				home: { open: "full" },
				article: { open: "closed", content: columns.article.content },
				shop: { open: "closed" },
				about: { open: "closed" },
			};
		case "open-about":
			return {
				home: { open: "closed" },
				article: { open: "closed", content: columns.article.content },
				shop: { open: "closed" },
				about: { open: "full" },
			};
		case "close-home":
			return {
				...columns,
				home: { open: "full" },
			};
		default:
			return columns;
	}
}

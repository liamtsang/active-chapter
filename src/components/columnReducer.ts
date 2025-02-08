import type { ColumnState, Action } from "@/types";

export const initialColumn: ColumnState = {
	home: { open: "third" },
	article: { open: "closed", article: null },
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
				article: { open: "closed", article: columns.article.article },
				shop: { open: "third" },
				about: { open: "third" },
			};
		case "open-article":
			return {
				home: { open: "third" },
				article: { open: "expanded", article: action.article },
				shop: { open: "closed" },
				about: { open: "closed" },
			};
		case "open-article-mobile":
			return {
				home: { open: "closed" },
				article: { open: "fullMobile", article: action.article },
				shop: { open: "closed" },
				about: { open: "closed" },
			};
		case "full-article":
			return {
				home: { open: "closed" },
				article: { open: "full", article: columns.article.article },
				shop: { open: "closed" },
				about: { open: "closed" },
			};
		case "change-article":
			return {
				home: { open: "third" },
				article: { open: columns.article.open, article: action.article },
				shop: { open: "closed" },
				about: { open: "closed" },
			};
		case "open-shop":
			return {
				home: { open: "closed" },
				article: { open: "closed", article: columns.article.article },
				shop: { open: "full" },
				about: { open: "closed" },
			};
		case "open-home":
			return {
				home: { open: "full" },
				article: { open: "closed", article: columns.article.article },
				shop: { open: "closed" },
				about: { open: "closed" },
			};
		case "open-about":
			return {
				home: { open: "closed" },
				article: { open: "closed", article: columns.article.article },
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

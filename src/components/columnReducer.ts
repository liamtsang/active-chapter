// columnReducer.ts
import type { ColumnState, Action } from "@/types";

export const initialColumn: ColumnState = {
	home: { open: "third" },
	article: { open: "closed", article: null },
	shop: { open: "third" },
	about: { open: "third" },
};

// Helper function to update URL based on state
function updateURL(state: ColumnState) {
	// We need to check if we're in a browser environment
	if (typeof window !== "undefined") {
		const url = new URL(window.location.href);

		// Clear existing params
		url.searchParams.delete("view");
		url.searchParams.delete("article");

		// Add new params based on state
		if (state.article.open !== "closed" && state.article.article) {
			url.searchParams.set("view", state.article.open);
			url.searchParams.set("article", state.article.article.title);
		} else if (state.shop.open === "full") {
			url.searchParams.set("view", "shop");
		} else if (state.about.open === "full") {
			url.searchParams.set("view", "about");
		} else if (state.home.open === "full") {
			url.searchParams.set("view", "home");
		}

		// Update URL without reload
		window.history.replaceState({}, "", url.toString());
	}
}

export function columnReducer(
	columns: ColumnState,
	action: Action,
): ColumnState {
	let newState: ColumnState;

	switch (action.type) {
		case "default":
			newState = {
				home: { open: "third" },
				article: { open: "closed", article: columns.article.article },
				shop: { open: "third" },
				about: { open: "third" },
			};
			break;
		case "open-article":
			newState = {
				home: { open: "third" },
				article: { open: "expanded", article: action.article },
				shop: { open: "closed" },
				about: { open: "closed" },
			};
			break;
		case "open-article-mobile":
			newState = {
				home: { open: "closed" },
				article: { open: "fullMobile", article: action.article },
				shop: { open: "closed" },
				about: { open: "closed" },
			};
			break;
		case "full-article":
			newState = {
				home: { open: "closed" },
				article: { open: "full", article: columns.article.article },
				shop: { open: "closed" },
				about: { open: "closed" },
			};
			break;
		case "change-article":
			newState = {
				home: { open: "third" },
				article: { open: columns.article.open, article: action.article },
				shop: { open: "closed" },
				about: { open: "closed" },
			};
			break;
		case "open-shop":
			newState = {
				home: { open: "closed" },
				article: { open: "closed", article: columns.article.article },
				shop: { open: "full" },
				about: { open: "closed" },
			};
			break;
		case "open-home":
			newState = {
				home: { open: "full" },
				article: { open: "closed", article: columns.article.article },
				shop: { open: "closed" },
				about: { open: "closed" },
			};
			break;
		case "open-about":
			newState = {
				home: { open: "closed" },
				article: { open: "closed", article: columns.article.article },
				shop: { open: "closed" },
				about: { open: "full" },
			};
			break;
		case "close-home":
			newState = {
				...columns,
				home: { open: "full" },
			};
			break;
		default:
			return columns;
	}

	// Update URL after state change
	updateURL(newState);
	return newState;
}

// Add a function to initialize state from URL
export function getInitialStateFromURL(): Partial<ColumnState> {
	if (typeof window === "undefined") return {};

	const params = new URLSearchParams(window.location.search);
	const view = params.get("view");

	// Make sure we return a complete state object, not partial
	switch (view) {
		case "expanded":
		case "full":
		case "fullMobile":
			return {
				home: { open: "third" },
				article: {
					open: view as "expanded" | "full" | "fullMobile",
					article: null,
				},
				shop: { open: "closed" },
				about: { open: "closed" },
			};

		case "shop":
			return {
				home: { open: "closed" },
				article: { open: "closed", article: null },
				shop: { open: "full" },
				about: { open: "closed" },
			};

		case "about":
			return {
				home: { open: "closed" },
				article: { open: "closed", article: null },
				shop: { open: "closed" },
				about: { open: "full" },
			};

		case "home":
			return {
				home: { open: "full" },
				article: { open: "closed", article: null },
				shop: { open: "closed" },
				about: { open: "closed" },
			};

		default:
			return initialColumn; // Return default state if no valid view
	}
}

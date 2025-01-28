import type { ColumnState, Action } from "@/types";
import Welcome from "@/markdown/welcome.mdx";

export const initialColumn: ColumnState = {
	home: { open: true },
	article: { open: false, content: Welcome },
	store: { open: true },
	about: { open: true },
};

export function columnReducer(
	columns: ColumnState,
	action: Action,
): ColumnState {
	switch (action.type) {
		case "open-article":
			return {
				home: { open: true },
				article: { open: true, content: action.content },
				store: { open: false },
				about: { open: false },
			};
		case "close-article":
			return {
				home: { open: true },
				article: { open: false, content: Welcome },
				store: { open: true },
				about: { open: true },
			};
		case "change-article":
			return {
				home: { open: true },
				article: { open: true, content: action.content },
				store: { open: false },
				about: { open: false },
			};
		default:
			return columns;
	}
}

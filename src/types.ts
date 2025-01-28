import type { MDXContent } from "mdx/types";

export type ValidColumnStates = "full" | "closed" | "third" | "expanded";

export type ColumnState = {
	home: {
		open: ValidColumnStates;
	};
	article: {
		open: ValidColumnStates;
		content: MDXContent;
	};
	shop: {
		open: ValidColumnStates;
	};
	about: {
		open: ValidColumnStates;
	};
};

export type Action = {
	type: string;
	content: MDXContent;
};

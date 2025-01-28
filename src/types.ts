import type { MDXContent } from "mdx/types";

export type ColumnState = {
	home: {
		open: boolean;
	};
	article: {
		open: boolean;
		content: MDXContent;
	};
	store: {
		open: boolean;
	};
	about: {
		open: boolean;
	};
};

export type Action = {
	type: string;
	content: MDXContent;
};

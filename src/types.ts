export type ValidColumnStates = "full" | "closed" | "third" | "expanded";

export type ColumnState = {
	home: {
		open: ValidColumnStates;
	};
	article: {
		open: ValidColumnStates;
		content: string;
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
	content: string;
};

export interface Article {
	id: number;
	title: string;
	author: string;
	journal: string;
	medium: string;
	publishDate: Date;
	tags: string[];
	content: string;
}

export interface ArticleFilters {
	author?: string;
	journal?: string;
	medium?: string;
	tags?: string[];
	startDate?: Date;
	endDate?: Date;
}

export interface Metadata {
	title: string;
	author: string;
	publishDate: Date;
	tags: string[];
	journal: string;
	medium: string;
	[key: string]: unknown;
}

export interface Env {
	NEXTJS_ENV: string;
	posts: R2Bucket;
	DB: D1Database;
	IMAGES: R2Bucket;
	ASSETS: Fetcher;
}

export type ValidColumnStates =
	| "full"
	| "closed"
	| "third"
	| "expanded"
	| "fullMobile";

export type ColumnState = {
	home: {
		open: ValidColumnStates;
	};
	article: {
		open: ValidColumnStates;
		article: Article | null;
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
	article: Article | null;
};

export interface Article {
	id: string;
	title: string;
	author: string;
	journal: string;
	medium: string;
	publishDate: Date;
	tags: string[];
	content: string;
	coverImage?: string;
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
	coverImage: string;
	[key: string]: unknown;
}

import type { MDXContent } from "mdx/types";

export const SelectedArticle = ({ article }: { article: MDXContent }) => (
	<article className="p-4 font-instrument prose prose-black">
		{article({})}
	</article>
);

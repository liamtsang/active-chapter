import type { Article } from "@/types";

export const SelectedArticle = ({ article }: { article: Article | null }) => {
	if (!article)
		return <article className="p-4 font-instrument prose prose-black" />;
	return (
		<>
			{article.coverImage && <img alt="cover Image" src={article.coverImage} />}
			{article.author && <h1>{article.author}</h1>}
			{article.journal && <h1>{article.journal}</h1>}
			<article
				className="p-4 font-instrument prose prose-black"
				dangerouslySetInnerHTML={{ __html: article.content }}
			/>
		</>
	);
};

import type { Article } from "@/types";

export const SelectedArticle = ({ article }: { article: Article | null }) => {
	if (!article)
		return <article className="p-4 font-instrument prose prose-black" />;
	return (
		<div className="p-4">
			{article.coverImage && (
				<img className="pb-4" alt="cover" src={article.coverImage} />
			)}
			{article.author && <h1 className="mb-0 pb-0">{article.author}</h1>}
			{article.journal && <h2 className="pb-4">{article.journal}</h2>}
			<article
				className="font-instrument prose prose-black xl:text-xl/9 pb-[20ch]"
				dangerouslySetInnerHTML={{ __html: article.content }}
			/>
		</div>
	);
};

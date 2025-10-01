// import Image from "next/image";
import type { Article } from "@/types";

export const SelectedArticle = ({ article }: { article: Article | null }) => {
	if (!article)
		return <article className="p-4 font-instrument prose prose-black" />;
	return (
		<div className="p-4">
			{article.coverImage && (
				<img
					className="pb-4 max-h-64 mx-auto"
					alt="cover"
					src={article.coverImage}
					width={400}
					height={200}
					style={{ objectFit: "contain" }}
				/>
			)}
			{article.author && <h1 className="mb-0 pb-0">{article.author}</h1>}
			{article.journal && <h2 className="hidden">{article.journal}</h2>}
			<article
				className="font-instrument prose prose-black xl:text-xl/9 pb-[20ch] pt-4"
				dangerouslySetInnerHTML={{ __html: article.content }}
			/>
		</div>
	);
};

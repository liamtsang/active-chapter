export const SelectedArticle = ({ article }: { article: string }) => (
	<article
		className="p-4 font-instrument prose prose-black"
		dangerouslySetInnerHTML={{ __html: article }}
	/>
);

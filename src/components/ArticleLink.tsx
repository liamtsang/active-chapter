interface ArticleMetadata {
  id: string;
  title: string;
  author: string;
  journal: string;
  medium: string;
  publishDate: Date;
  tags: string[];
  coverImage: string;
}

export const ArticleLink = ({
	day,
	month,
	title,
	article,
	toggleArticle,
}: {
	day: string;
	month: string;
	title: string;
	article: ArticleMetadata;
	toggleArticle: (article: ArticleMetadata) => void;
}) => (
	<li
		onClick={(e) => {
			e.stopPropagation();
			toggleArticle(article);
		}}
		className="text-base/4 md:text-2xl/5 gap-2 md:leading-6 flex flex-row md:gap-6 border-black border-b-[1px] pl-2 md:pl-2 py-2"
	>
		<div className="hidden md:block">
			<div>{month}</div>
			<div>{day}</div>
		</div>
		<h2 className="uppercase">{title} →</h2>
	</li>
);

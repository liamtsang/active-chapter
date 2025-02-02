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
	article: string;
	toggleArticle: (content: string) => void;
}) => (
	<li
		onClick={() => toggleArticle(article)}
		className="leading-6 flex flex-row gap-6 border-black border-b-[1px] pl-6 py-2"
	>
		<div>
			<div>{month}</div>
			<div>{day}</div>
		</div>
		<h2 className="uppercase">{title} →</h2>
	</li>
);

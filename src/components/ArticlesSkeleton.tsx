const ArticleLinkSkeleton = () => (
	<div className="flex border-b border-gray-200 py-4 animate-pulse">
		<div className="w-16 flex flex-col items-center mr-4">
			<div className="h-6 bg-gray-200 rounded w-8 mb-1"></div>
			<div className="h-4 bg-gray-200 rounded w-10"></div>
		</div>
		<div className="flex-1 space-y-2">
			<div className="h-6 bg-gray-200 rounded w-3/4"></div>
			<div className="flex space-x-4 text-sm">
				<div className="h-4 bg-gray-200 rounded w-20"></div>
				<div className="h-4 bg-gray-200 rounded w-24"></div>
				<div className="h-4 bg-gray-200 rounded w-16"></div>
			</div>
			<div className="flex space-x-2">
				<div className="h-4 bg-gray-200 rounded w-12"></div>
				<div className="h-4 bg-gray-200 rounded w-16"></div>
				<div className="h-4 bg-gray-200 rounded w-14"></div>
			</div>
		</div>
	</div>
);

export const ArticlesListSkeleton = () => (
	<div className="space-y-0">
		{Array.from({ length: 5 }).map((_, index) => (
			<ArticleLinkSkeleton key={index} />
		))}
	</div>
);

export const ArticleContentSkeleton = () => (
	<div className="p-6 space-y-6 animate-pulse">
		<div className="space-y-4">
			<div className="h-8 bg-gray-200 rounded w-3/4"></div>
			<div className="flex space-x-4 text-sm">
				<div className="h-4 bg-gray-200 rounded w-20"></div>
				<div className="h-4 bg-gray-200 rounded w-24"></div>
				<div className="h-4 bg-gray-200 rounded w-16"></div>
			</div>
		</div>
		
		<div className="h-48 bg-gray-200 rounded"></div>
		
		<div className="space-y-4">
			<div className="h-4 bg-gray-200 rounded"></div>
			<div className="h-4 bg-gray-200 rounded"></div>
			<div className="h-4 bg-gray-200 rounded w-5/6"></div>
			<div className="h-4 bg-gray-200 rounded"></div>
			<div className="h-4 bg-gray-200 rounded w-4/5"></div>
		</div>
		
		<div className="space-y-4">
			<div className="h-4 bg-gray-200 rounded"></div>
			<div className="h-4 bg-gray-200 rounded w-3/4"></div>
			<div className="h-4 bg-gray-200 rounded"></div>
			<div className="h-4 bg-gray-200 rounded w-5/6"></div>
		</div>
	</div>
);
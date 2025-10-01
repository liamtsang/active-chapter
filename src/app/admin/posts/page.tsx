// app/admin/posts/page.tsx
"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { deleteArticle, getArticleLinks } from "@/lib/db";
import { useEffect, useState } from "react";

interface Article {
	id: string;
	title: string;
	author: string;
	journal: string;
	medium: string;
	publishDate: Date;
	tags: string[];
	coverImage?: string;
}

export default function PostsAdmin() {
	const [articles, setArticles] = useState<Article[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const { toast } = useToast();

	useEffect(() => {
		let mounted = true;
		async function loadArticles() {
			try {
				const fetchedArticles = await getArticleLinks();
				if (mounted) {
					setArticles(fetchedArticles);
				}
			} catch (err) {
				if (mounted) {
					console.error(err);
				}
			} finally {
				if (mounted) {
					setIsLoading(false);
				}
			}
		}
		loadArticles();
		return () => {
			mounted = false;
		};
	}, []);

	const handleDelete = async (id: string) => {
		try {
			await deleteArticle(id);
			setArticles((prev) => prev.filter((article) => article.id !== id));
			toast({
				title: "Success",
				description: "Article deleted successfully",
			});
		} catch (error) {
			console.error("Error deleting article:", error);
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to delete article",
			});
		}
	};

	if (isLoading) {
		return <div className="flex justify-center p-8">Loading...</div>;
	}

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Articles</h1>
				<Button onClick={() => router.push("/admin")}>New Article</Button>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Author</TableHead>
						<TableHead>Journal</TableHead>
						<TableHead>Published</TableHead>
						<TableHead>Tags</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{articles.map((article) => (
						<TableRow key={article.id}>
							<TableCell className="font-medium">{article.title}</TableCell>
							<TableCell>{article.author}</TableCell>
							<TableCell>{article.journal}</TableCell>
							<TableCell>
								{format(new Date(article.publishDate), "PPP")}
							</TableCell>
							<TableCell>{article.tags.join(", ")}</TableCell>
							<TableCell className="text-right">
								<div className="flex justify-end gap-2">
									<Button
										variant="outline"
										size="icon"
										onClick={() => router.push(`/admin/edit/${article.id}`)}
									>
										<Edit className="h-4 w-4" />
									</Button>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button variant="destructive" size="icon">
												<Trash2 className="h-4 w-4" />
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>Delete Article</AlertDialogTitle>
												<AlertDialogDescription>
													Are you sure you want to delete this article? This
													action cannot be undone.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction
													onClick={() => handleDelete(article.id)}
												>
													Delete
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

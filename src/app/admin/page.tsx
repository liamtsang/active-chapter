"use client";

import { useState, useEffect } from "react";
import Tiptap from "./Tiptap";
import MetadataForm from "./metadata-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { saveArticle } from "@/lib/db";

interface Metadata {
	title: string;
	author: string;
	publishDate: Date;
	tags: string[];
	journal: string;
	medium: string;
	[key: string]: unknown;
}

interface ValidationError {
	field: string;
	message: string;
}

export default function Home() {
	const [metadata, setMetadata] = useState<Metadata | null>(null);
	const [editorContent, setEditorContent] = useState<string>("");
	const [isSaving, setIsSaving] = useState(false);
	const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const { toast } = useToast();

	// Validation function
	const validateArticle = (): ValidationError[] => {
		const errors: ValidationError[] = [];

		if (!metadata) {
			errors.push({ field: "metadata", message: "Metadata is required" });
			return errors;
		}

		if (!metadata.title) {
			errors.push({ field: "title", message: "Title is required" });
		}

		if (!metadata.author) {
			errors.push({ field: "author", message: "Author is required" });
		}

		if (!metadata.journal) {
			errors.push({ field: "journal", message: "Journal is required" });
		}

		if (metadata.tags.length === 0) {
			errors.push({ field: "tags", message: "At least one tag is required" });
		}

		if (!editorContent || editorContent === "<p></p>") {
			errors.push({ field: "content", message: "Article content is required" });
		}

		return errors;
	};

	const handleMetadataChange = (newMetadata: Metadata) => {
		setMetadata(newMetadata);
		console.log(newMetadata);
		setHasUnsavedChanges(true);
	};

	const handleContentChange = (newContent: string) => {
		setEditorContent(newContent);
		setHasUnsavedChanges(true);
	};

	// Save function with error handling and loading state
	const handleSave = async () => {
		// Basic validation
		if (!metadata?.title) {
			toast({
				variant: "destructive",
				title: "Missing title",
				description: "Please enter a title for the article",
			});
			return;
		}

		if (!metadata?.author) {
			toast({
				variant: "destructive",
				title: "Missing author",
				description: "Please select an author",
			});
			return;
		}

		if (!editorContent || editorContent === "<p></p>") {
			toast({
				variant: "destructive",
				title: "Missing content",
				description: "Please add some content to the article",
			});
			return;
		}

		setIsSaving(true);

		try {
			await saveArticle({
				title: metadata.title,
				author: metadata.author,
				publishDate: metadata.publishDate,
				tags: metadata.tags,
				journal: metadata.journal,
				medium: metadata.medium,
				content: editorContent,
			});

			toast({
				title: "Success",
				description: "Article saved successfully!",
			});
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to save article",
			});
			console.error(error);
		} finally {
			setIsSaving(false);
		}
	};

	// Handle browser refresh/navigation
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hasUnsavedChanges) {
				e.preventDefault();
				e.returnValue = "";
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [hasUnsavedChanges]);

	return (
		<>
			<main className="font-instrument p-4 w-full h-dvh overflow-y-scroll flex flex-col items-center justify-start gap-8">
				<div className="max-w-[65ch] w-full flex flex-col items-center justify-start gap-8">
					<MetadataForm
						onMetadataChange={handleMetadataChange}
						hasErrors={validateArticle().some(
							(error) => error.field === "metadata",
						)}
					/>
					<Tiptap
						onContentChange={handleContentChange}
						hasErrors={validateArticle().some(
							(error) => error.field === "content",
						)}
					/>
					<Button
						onClick={handleSave}
						className="w-full max-w-[65ch]"
						size="lg"
						disabled={isSaving || !hasUnsavedChanges}
					>
						{isSaving ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Saving...
							</>
						) : (
							"Save Article"
						)}
					</Button>
					{hasUnsavedChanges && (
						<p className="text-sm text-muted-foreground">
							You have unsaved changes
						</p>
					)}
				</div>
			</main>

			<AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
						<AlertDialogDescription>
							You have unsaved changes. Are you sure you want to leave? Your
							changes will be lost.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction>Leave</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<Toaster />
		</>
	);
}

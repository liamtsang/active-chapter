"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Tiptap from "../../Tiptap";
import MetadataForm from "../../metadata-form";
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
import { getArticleById, updateArticle } from "@/lib/db";
import type { Metadata } from "@/types";

interface ValidationError {
  field: string;
  message: string;
}

export default function EditArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialMetadata, setInitialMetadata] = useState<Metadata | null>(null);
  const [initialContent, setInitialContent] = useState<string>("");
  const { toast } = useToast();

  // Load article data
  useEffect(() => {
    async function loadArticle() {
      try {
        const article = await getArticleById(id);
        if (!article) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Article not found",
          });
          router.push("/admin/posts");
          return;
        }

        const metadataData: Metadata = {
          title: article.title,
          author: article.author,
          publishDate: new Date(article.publishDate),
          tags: article.tags,
          journal: article.journal,
          medium: article.medium,
          coverImage: article.coverImage || "",
        };

        setInitialMetadata(metadataData);
        setInitialContent(article.content);
        setMetadata(metadataData);
        setEditorContent(article.content);
      } catch (error) {
        console.error("Error loading article:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load article",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadArticle();
  }, [id, router, toast]);

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
      await updateArticle(id, {
        title: metadata.title,
        author: metadata.author,
        publishDate: metadata.publishDate,
        tags: metadata.tags,
        journal: metadata.journal,
        medium: metadata.medium,
        content: editorContent,
        coverImage: metadata.coverImage,
      });

      setHasUnsavedChanges(false);
      toast({
        title: "Success",
        description: "Article updated successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update article",
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="font-instrument flex flex-col items-center justify-start gap-8">
        <div className="max-w-[65ch] w-full flex flex-col items-center justify-start gap-8">
          <h1 className="text-2xl font-bold self-start">Edit Article</h1>
          {initialMetadata && (
            <MetadataForm
              onMetadataChange={handleMetadataChange}
              hasErrors={validateArticle().some(
                (error) => error.field === "metadata",
              )}
              initialData={initialMetadata}
            />
          )}
          {initialContent && (
            <Tiptap
              onContentChange={handleContentChange}
              hasErrors={validateArticle().some(
                (error) => error.field === "content",
              )}
              initialContent={initialContent}
            />
          )}
          <div className="w-full flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/posts")}
              className="flex-1"
              size="lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
              size="lg"
              disabled={isSaving || !hasUnsavedChanges}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Update Article"
              )}
            </Button>
          </div>
          {hasUnsavedChanges && (
            <p className="text-sm text-muted-foreground">
              You have unsaved changes
            </p>
          )}
        </div>
      </div>

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

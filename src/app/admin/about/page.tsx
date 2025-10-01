"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AboutAdminPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [initialContent, setInitialContent] = useState("");
	const [showLinkDialog, setShowLinkDialog] = useState(false);
	const [linkUrl, setLinkUrl] = useState("");
	const [linkText, setLinkText] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { toast } = useToast();

	const handleImageUpload = async (file: File) => {
		try {
			const formData = new FormData();
			formData.set("image", file);

			const response = await fetch("/api/images/upload", {
				method: "PUT",
				headers: {
					Authorization: `Basic ${btoa("active:chapter")}`,
				},
				body: formData,
			});

			if (!response.ok) {
				throw new Error(`Upload failed: ${response.statusText}`);
			}

			const key = await response.text();
			editor
				?.chain()
				.focus()
				.setImage({ src: `https://activechapter.online/api/images/${key}` })
				.run();
		} catch (error) {
			console.error("Upload error:", error);
			toast({
				title: "Error",
				description: "Failed to upload image",
				variant: "destructive",
			});
		}
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			handleImageUpload(file);
		}
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const editor = useEditor({
		extensions: [
			StarterKit,
			Image.configure({
				inline: true,
				allowBase64: true,
			}),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: 'text-blue-600 underline hover:text-blue-800',
				},
			}),
		],
		immediatelyRender: false,
		content: initialContent,
	});

	const handleAddLink = useCallback(() => {
		if (!editor) return;
		const { from, to } = editor.state.selection;
		const selectedText = editor.state.doc.textBetween(from, to);
		
		if (selectedText) {
			setLinkText(selectedText);
		} else {
			setLinkText("");
		}
		setLinkUrl("");
		setShowLinkDialog(true);
	}, [editor]);

	const insertLink = useCallback(() => {
		if (!editor || !linkUrl) return;

		const { from, to } = editor.state.selection;
		
		if (linkText && from === to) {
			// No text selected, insert new text with link
			editor
				.chain()
				.focus()
				.insertContent(`<a href="${linkUrl}">${linkText}</a>`)
				.run();
		} else {
			// Text is selected, add link to selection
			editor
				.chain()
				.focus()
				.setLink({ href: linkUrl })
				.run();
		}
		
		setShowLinkDialog(false);
		setLinkUrl("");
		setLinkText("");
	}, [editor, linkUrl, linkText]);

	useEffect(() => {
		const fetchAboutContent = async () => {
			try {
				const response = await fetch("/api/about");
				const data = await response.json() as { content: string };
				setInitialContent(data.content);
				if (editor) {
					editor.commands.setContent(data.content);
				}
			} catch (error) {
				console.error("Error fetching about content:", error);
				toast({
					title: "Error",
					description: "Failed to fetch about content",
					variant: "destructive",
				});
			}
		};

		fetchAboutContent();
	}, [editor, toast]);

	const handleSave = async () => {
		if (!editor) return;

		setIsLoading(true);
		try {
			const content = editor.getHTML();
			const response = await fetch("/api/about", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Basic ${btoa("active:chapter")}`,
				},
				body: JSON.stringify({ content }),
			});

			if (!response.ok) {
				throw new Error("Failed to save about content");
			}

			toast({
				title: "Success",
				description: "About content saved successfully",
			});
		} catch (error) {
			console.error("Error saving about content:", error);
			toast({
				title: "Error",
				description: "Failed to save about content",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (!editor) {
		return <div>Loading editor...</div>;
	}

	return (
		<div>
			<Card className="max-w-4xl mx-auto">
				<CardHeader>
					<CardTitle>About Page Content Management</CardTitle>
					<CardDescription>
						Edit the content that will be displayed on the About page
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="font-instrument text-base max-w-fit overflow-y-scroll">
						<div className="control-group max-w-[65ch]">
							<div className="sticky top-0 bg-white z-[2] pb-4 rounded-sm button-group flex flex-wrap gap-2">
								<Button
									onClick={() => editor.chain().focus().toggleBold().run()}
									disabled={!editor.can().chain().focus().toggleBold().run()}
									variant={editor.isActive("bold") ? "default" : "outline"}
									size="sm"
								>
									Bold
								</Button>
								<Button
									onClick={() => editor.chain().focus().toggleItalic().run()}
									disabled={!editor.can().chain().focus().toggleItalic().run()}
									variant={editor.isActive("italic") ? "default" : "outline"}
									size="sm"
								>
									Italic
								</Button>
								<Button
									onClick={() => editor.chain().focus().toggleStrike().run()}
									disabled={!editor.can().chain().focus().toggleStrike().run()}
									variant={editor.isActive("strike") ? "default" : "outline"}
									size="sm"
								>
									Strike
								</Button>
								<Button
									onClick={() => editor.chain().focus().toggleCode().run()}
									disabled={!editor.can().chain().focus().toggleCode().run()}
									variant={editor.isActive("code") ? "default" : "outline"}
									size="sm"
								>
									Code
								</Button>
								<Button
									onClick={() =>
										editor.chain().focus().toggleHeading({ level: 1 }).run()
									}
									variant={
										editor.isActive("heading", { level: 1 }) ? "default" : "outline"
									}
									size="sm"
								>
									H1
								</Button>
								<Button
									onClick={() =>
										editor.chain().focus().toggleHeading({ level: 2 }).run()
									}
									variant={
										editor.isActive("heading", { level: 2 }) ? "default" : "outline"
									}
									size="sm"
								>
									H2
								</Button>
								<Button
									onClick={() =>
										editor.chain().focus().toggleHeading({ level: 3 }).run()
									}
									variant={
										editor.isActive("heading", { level: 3 }) ? "default" : "outline"
									}
									size="sm"
								>
									H3
								</Button>
								<Button
									onClick={() => editor.chain().focus().toggleBulletList().run()}
									variant={editor.isActive("bulletList") ? "default" : "outline"}
									size="sm"
								>
									Bullet List
								</Button>
								<Button
									onClick={() => editor.chain().focus().toggleOrderedList().run()}
									variant={editor.isActive("orderedList") ? "default" : "outline"}
									size="sm"
								>
									Ordered List
								</Button>
								<Button
									onClick={() => editor.chain().focus().toggleBlockquote().run()}
									variant={editor.isActive("blockquote") ? "default" : "outline"}
									size="sm"
								>
									Quote
								</Button>
								<Button
									onClick={() => fileInputRef.current?.click()}
									variant="outline"
									size="sm"
								>
									Image
								</Button>
								<input
									type="file"
									ref={fileInputRef}
									onChange={handleFileInputChange}
									accept="image/*"
									style={{ display: "none" }}
								/>
								<Button
									onClick={handleAddLink}
									variant={editor.isActive("link") ? "default" : "outline"}
									size="sm"
								>
									Link
								</Button>
								<Button
									onClick={() => editor.chain().focus().unsetLink().run()}
									disabled={!editor.isActive("link")}
									variant="outline"
									size="sm"
								>
									Unlink
								</Button>
								<Button
									onClick={() => editor.chain().focus().undo().run()}
									disabled={!editor.can().chain().focus().undo().run()}
									variant="outline"
									size="sm"
								>
									Undo
								</Button>
								<Button
									onClick={() => editor.chain().focus().redo().run()}
									disabled={!editor.can().chain().focus().redo().run()}
									variant="outline"
									size="sm"
								>
									Redo
								</Button>
							</div>
							<EditorContent
								className="mt-4 font-instrument prose prose-black min-h-[300px] border rounded-md p-4"
								editor={editor}
							/>
						</div>
					</div>
					<div className="mt-6 flex justify-end">
						<Button onClick={handleSave} disabled={isLoading}>
							{isLoading ? "Saving..." : "Save About Content"}
						</Button>
					</div>
				</CardContent>
			</Card>

			<Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Link</DialogTitle>
						<DialogDescription>
							Enter the URL and link text below
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium">URL</label>
							<Input
								value={linkUrl}
								onChange={(e) => setLinkUrl(e.target.value)}
								placeholder="https://example.com"
								type="url"
							/>
						</div>
						<div>
							<label className="text-sm font-medium">Link Text</label>
							<Input
								value={linkText}
								onChange={(e) => setLinkText(e.target.value)}
								placeholder="Click here"
							/>
						</div>
						<div className="flex justify-end space-x-2">
							<Button variant="outline" onClick={() => setShowLinkDialog(false)}>
								Cancel
							</Button>
							<Button onClick={insertLink} disabled={!linkUrl}>
								Add Link
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
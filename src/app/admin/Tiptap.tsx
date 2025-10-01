"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useRef, useState, useCallback } from "react";
import type React from "react";

interface TiptapProps {
	onContentChange: (content: string) => void;
	hasErrors?: boolean;
}

const Tiptap: React.FC<TiptapProps> = ({ onContentChange, hasErrors }) => {
	const [showLinkDialog, setShowLinkDialog] = useState(false);
	const [linkUrl, setLinkUrl] = useState("");
	const [linkText, setLinkText] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

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
			throw error;
		}
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			handleImageUpload(file);
		}
		// Reset the input
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const editor = useEditor({
		extensions: [
			StarterKit,
			Image.configure({
				inline: true, // Change to false if you want images on separate lines
				allowBase64: true, // Allow base64 encoded images
			}),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: 'text-blue-600 underline hover:text-blue-800',
				},
			}),
		],
		immediatelyRender: false,
		content: "<p>Hello World! 🌎️</p>",
		onUpdate: ({ editor }) => {
			onContentChange(editor.getHTML());
		},
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

	if (!editor) {
		return null;
	}

	return (
		<>
			<Card className={`max-w-fit ${hasErrors ? "bg-red" : ""}`}>
				<CardHeader>
					<CardTitle>Article </CardTitle>
					<CardDescription>Write the article here</CardDescription>
				</CardHeader>
				<CardContent>
					<section className="font-instrument text-base max-w-fit overflow-y-scroll">
						<div className="control-group max-w-[65ch]">
							<div className="sticky top-0 bg-white z-[2] pb-4 rounded-sm button-group">
							<Button
								onClick={() => editor.chain().focus().toggleBold().run()}
								disabled={!editor.can().chain().focus().toggleBold().run()}
								className={editor.isActive("bold") ? "is-active" : ""}
							>
								Bold
							</Button>
							<Button
								onClick={() => editor.chain().focus().toggleItalic().run()}
								disabled={!editor.can().chain().focus().toggleItalic().run()}
								className={editor.isActive("italic") ? "is-active" : ""}
							>
								Italic
							</Button>
							<Button
								onClick={() => editor.chain().focus().toggleStrike().run()}
								disabled={!editor.can().chain().focus().toggleStrike().run()}
								className={editor.isActive("strike") ? "is-active" : ""}
							>
								Strike
							</Button>
							<Button
								onClick={() => editor.chain().focus().toggleCode().run()}
								disabled={!editor.can().chain().focus().toggleCode().run()}
								className={editor.isActive("code") ? "is-active" : ""}
							>
								Code
							</Button>
							<Button
								onClick={() => editor.chain().focus().unsetAllMarks().run()}
							>
								Clear marks
							</Button>
							<Button onClick={() => editor.chain().focus().clearNodes().run()}>
								Clear nodes
							</Button>
							<Button
								onClick={() => editor.chain().focus().setParagraph().run()}
								className={editor.isActive("paragraph") ? "is-active" : ""}
							>
								Paragraph
							</Button>
							<Button
								onClick={() =>
									editor.chain().focus().toggleHeading({ level: 1 }).run()
								}
								className={
									editor.isActive("heading", { level: 1 }) ? "is-active" : ""
								}
							>
								H1
							</Button>
							<Button
								onClick={() =>
									editor.chain().focus().toggleHeading({ level: 2 }).run()
								}
								className={
									editor.isActive("heading", { level: 2 }) ? "is-active" : ""
								}
							>
								H2
							</Button>
							<Button
								onClick={() =>
									editor.chain().focus().toggleHeading({ level: 3 }).run()
								}
								className={
									editor.isActive("heading", { level: 3 }) ? "is-active" : ""
								}
							>
								H3
							</Button>
							<Button
								onClick={() =>
									editor.chain().focus().toggleHeading({ level: 4 }).run()
								}
								className={
									editor.isActive("heading", { level: 4 }) ? "is-active" : ""
								}
							>
								H4
							</Button>
							<Button
								onClick={() =>
									editor.chain().focus().toggleHeading({ level: 5 }).run()
								}
								className={
									editor.isActive("heading", { level: 5 }) ? "is-active" : ""
								}
							>
								H5
							</Button>
							<Button
								onClick={() =>
									editor.chain().focus().toggleHeading({ level: 6 }).run()
								}
								className={
									editor.isActive("heading", { level: 6 }) ? "is-active" : ""
								}
							>
								H6
							</Button>
							<Button
								onClick={() => editor.chain().focus().toggleBulletList().run()}
								className={editor.isActive("bulletList") ? "is-active" : ""}
							>
								Bullet list
							</Button>
							<Button
								onClick={() => editor.chain().focus().toggleOrderedList().run()}
								className={editor.isActive("orderedList") ? "is-active" : ""}
							>
								Ordered list
							</Button>
							<Button
								onClick={() => editor.chain().focus().toggleCodeBlock().run()}
								className={editor.isActive("codeBlock") ? "is-active" : ""}
							>
								Code block
							</Button>
							<Button
								onClick={() => editor.chain().focus().toggleBlockquote().run()}
								className={editor.isActive("blockquote") ? "is-active" : ""}
							>
								Blockquote
							</Button>
							<Button
								onClick={() => editor.chain().focus().setHorizontalRule().run()}
							>
								Horizontal rule
							</Button>
							<Button
								onClick={() => editor.chain().focus().setHardBreak().run()}
							>
								Hard break
							</Button>
							{/* Image Upload Button */}
							<Button
								onClick={() => fileInputRef.current?.click()}
								title="Upload Image"
							>
								Image
							</Button>
							{/* Hidden file input */}
							<input
								type="file"
								ref={fileInputRef}
								onChange={handleFileInputChange}
								accept="image/*"
								style={{ display: "none" }}
							/>
							<Button
								onClick={handleAddLink}
								className={editor.isActive("link") ? "is-active" : ""}
							>
								Link
							</Button>
							<Button
								onClick={() => editor.chain().focus().unsetLink().run()}
								disabled={!editor.isActive("link")}
							>
								Unlink
							</Button>
							<Button
								onClick={() => editor.chain().focus().undo().run()}
								disabled={!editor.can().chain().focus().undo().run()}
							>
								Undo
							</Button>
							<Button
								onClick={() => editor.chain().focus().redo().run()}
								disabled={!editor.can().chain().focus().redo().run()}
							>
								Redo
							</Button>
						</div>
						<EditorContent
							className="mt-1 font-instrument prose prose-black"
							editor={editor}
						/>
						</div>
					</section>
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
		</>
	);
};

export default Tiptap;

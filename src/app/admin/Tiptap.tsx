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
import StarterKit from "@tiptap/starter-kit";
import React from "react";

interface TiptapProps {
	onContentChange: (content: string) => void;
	hasErrors?: boolean;
}

const Tiptap: React.FC<TiptapProps> = ({ onContentChange, hasErrors }) => {
	const editor = useEditor({
		extensions: [StarterKit],
		immediatelyRender: false,
		content: "<p>Hello World! 🌎️</p>",
		onUpdate: ({ editor }) => {
			onContentChange(editor.getHTML());
			console.log(editor.getText());
			console.log(editor.getJSON());
		},
	});

	console.log(hasErrors);

	if (!editor) {
		return null;
	}

	return (
		<Card className="max-w-fit">
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
							className="mt-1 font-instrument prose prose-black "
							editor={editor}
						/>
					</div>
				</section>
			</CardContent>
		</Card>
	);
};

export default Tiptap;

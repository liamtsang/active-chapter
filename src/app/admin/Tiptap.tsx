"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";

const Tiptap = () => {
	const editor = useEditor({
		extensions: [StarterKit],
		immediatelyRender: false,
		content: "<p>Hello World! 🌎️</p>",
	});

	if (!editor) {
		return null;
	}

	return (
		<main className="h-dvh relative overflow-y-scroll p-6 flex flex-cols gap-12">
			<section className="outline outline-[1px] outline-black rounded-t-xl font-instrument text-base max-w-fit">
				<h1 className="p-2 bg-black text-white rounded-t-xl mb-4 text-2xl">
					Editor
				</h1>
				<div className="p-2 control-group max-w-[65ch]">
					<div className="sticky top-0 bg-white z-[2] py-4 rounded-sm button-group">
						<button
							onClick={() => editor.chain().focus().toggleBold().run()}
							disabled={!editor.can().chain().focus().toggleBold().run()}
							className={editor.isActive("bold") ? "is-active" : ""}
						>
							Bold
						</button>
						<button
							onClick={() => editor.chain().focus().toggleItalic().run()}
							disabled={!editor.can().chain().focus().toggleItalic().run()}
							className={editor.isActive("italic") ? "is-active" : ""}
						>
							Italic
						</button>
						<button
							onClick={() => editor.chain().focus().toggleStrike().run()}
							disabled={!editor.can().chain().focus().toggleStrike().run()}
							className={editor.isActive("strike") ? "is-active" : ""}
						>
							Strike
						</button>
						<button
							onClick={() => editor.chain().focus().toggleCode().run()}
							disabled={!editor.can().chain().focus().toggleCode().run()}
							className={editor.isActive("code") ? "is-active" : ""}
						>
							Code
						</button>
						<button
							onClick={() => editor.chain().focus().unsetAllMarks().run()}
						>
							Clear marks
						</button>
						<button onClick={() => editor.chain().focus().clearNodes().run()}>
							Clear nodes
						</button>
						<button
							onClick={() => editor.chain().focus().setParagraph().run()}
							className={editor.isActive("paragraph") ? "is-active" : ""}
						>
							Paragraph
						</button>
						<button
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 1 }).run()
							}
							className={
								editor.isActive("heading", { level: 1 }) ? "is-active" : ""
							}
						>
							H1
						</button>
						<button
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 2 }).run()
							}
							className={
								editor.isActive("heading", { level: 2 }) ? "is-active" : ""
							}
						>
							H2
						</button>
						<button
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 3 }).run()
							}
							className={
								editor.isActive("heading", { level: 3 }) ? "is-active" : ""
							}
						>
							H3
						</button>
						<button
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 4 }).run()
							}
							className={
								editor.isActive("heading", { level: 4 }) ? "is-active" : ""
							}
						>
							H4
						</button>
						<button
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 5 }).run()
							}
							className={
								editor.isActive("heading", { level: 5 }) ? "is-active" : ""
							}
						>
							H5
						</button>
						<button
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 6 }).run()
							}
							className={
								editor.isActive("heading", { level: 6 }) ? "is-active" : ""
							}
						>
							H6
						</button>
						<button
							onClick={() => editor.chain().focus().toggleBulletList().run()}
							className={editor.isActive("bulletList") ? "is-active" : ""}
						>
							Bullet list
						</button>
						<button
							onClick={() => editor.chain().focus().toggleOrderedList().run()}
							className={editor.isActive("orderedList") ? "is-active" : ""}
						>
							Ordered list
						</button>
						<button
							onClick={() => editor.chain().focus().toggleCodeBlock().run()}
							className={editor.isActive("codeBlock") ? "is-active" : ""}
						>
							Code block
						</button>
						<button
							onClick={() => editor.chain().focus().toggleBlockquote().run()}
							className={editor.isActive("blockquote") ? "is-active" : ""}
						>
							Blockquote
						</button>
						<button
							onClick={() => editor.chain().focus().setHorizontalRule().run()}
						>
							Horizontal rule
						</button>
						<button onClick={() => editor.chain().focus().setHardBreak().run()}>
							Hard break
						</button>
						<button
							onClick={() => editor.chain().focus().undo().run()}
							disabled={!editor.can().chain().focus().undo().run()}
						>
							Undo
						</button>
						<button
							onClick={() => editor.chain().focus().redo().run()}
							disabled={!editor.can().chain().focus().redo().run()}
						>
							Redo
						</button>
					</div>
					<EditorContent
						className="mt-1 font-instrument prose prose-black"
						editor={editor}
					/>
				</div>
			</section>
			<section className="w-full outline outline-[1px] outline-black rounded-t-xl font-instrument text-base max-w-fit">
				<h1 className="p-2 bg-black text-white rounded-t-xl mb-4 text-2xl">
					Metadata
				</h1>
				<div className="space-y-4 mx-2">
					<div className="flex flex-col gap-1">
						<label className="rounded-sm" htmlFor="title">
							Title
						</label>
						<input
							name="title"
							className="outline outline-black outline-[1px] rounded-sm"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label className="rounded-sm" htmlFor="author">
							Author
						</label>
						<input
							name="author"
							className="outline outline-black outline-[1px] rounded-sm"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label className="rounded-sm" htmlFor="date">
							Publication Date MM-DD-YYYY
						</label>
						<input
							name="date"
							className="outline outline-black outline-[1px] rounded-sm"
						/>
					</div>
					<button
						className="bg-black text-white rounded-md px-2 "
						type="submit"
					>
						Submit
					</button>
				</div>
			</section>
		</main>
	);
};

export default Tiptap;

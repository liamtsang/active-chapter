// app/api/articles/[id]/route.ts
import * as server from "next/server";
import { deleteArticle } from "@/lib/db";

export async function DELETE(
	request: server.NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		await deleteArticle(params.id);
		return server.NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting article:", error);
		return server.NextResponse.json(
			{ error: "Failed to delete article" },
			{ status: 500 },
		);
	}
}

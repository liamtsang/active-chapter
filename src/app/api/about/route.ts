import { NextRequest, NextResponse } from "next/server";
import { getAboutContent, saveAboutContent } from "@/lib/db";

export async function GET() {
	try {
		const content = await getAboutContent();
		return NextResponse.json({ content }, {
			headers: {
				// ISR headers for about content
				'Cache-Control': 's-maxage=300, stale-while-revalidate=600'
			}
		});
	} catch (error) {
		console.error("Error fetching about content:", error);
		return NextResponse.json(
			{ error: "Failed to fetch about content" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const authHeader = request.headers.get("authorization");
		if (!authHeader || !authHeader.startsWith("Basic ")) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const base64Credentials = authHeader.slice("Basic ".length);
		const credentials = atob(base64Credentials);
		
		if (credentials !== "active:chapter") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { content } = await request.json() as { content: string };
		
		if (typeof content !== "string") {
			return NextResponse.json(
				{ error: "Content must be a string" },
				{ status: 400 }
			);
		}

		await saveAboutContent(content);
		
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error updating about content:", error);
		return NextResponse.json(
			{ error: "Failed to update about content" },
			{ status: 500 }
		);
	}
}
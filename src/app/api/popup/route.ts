import { NextRequest, NextResponse } from "next/server";
import { getPopupContent, savePopupContent } from "@/lib/db";

export async function GET() {
	try {
		const content = await getPopupContent();
		return NextResponse.json({ content });
	} catch (error) {
		console.error("Error fetching popup content:", error);
		return NextResponse.json(
			{ error: "Failed to fetch popup content" },
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

		await savePopupContent(content);
		
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error updating popup content:", error);
		return NextResponse.json(
			{ error: "Failed to update popup content" },
			{ status: 500 }
		);
	}
}
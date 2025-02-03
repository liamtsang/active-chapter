// app/api/images/[key]/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { getR2 } from "@/lib/r2";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const key = params.id;

	try {
		const r2 = await getR2();
		const object = await r2.get(key);

		if (!object) {
			return new NextResponse("Not Found", { status: 404 });
		}

		const data = await object.arrayBuffer();
		const contentType =
			object.httpMetadata?.contentType || "application/octet-stream";

		// Set cache headers
		const maxAge = 60 * 60 * 24 * 30; // 30 days

		return new NextResponse(data, {
			headers: {
				"Content-Type": contentType,
				"Cache-Control": `public, max-age=${maxAge}`,
			},
		});
	} catch (error) {
		console.error("Error fetching image:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

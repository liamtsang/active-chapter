// app/api/images/upload/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { getR2 } from "@/lib/r2";

// Helper function to generate SHA-256 hash
async function sha256(data: ArrayBuffer): Promise<string> {
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Helper function to get file extension from mime type
function getExtension(mimeType: string): string {
	const extensions: Record<string, string> = {
		"image/jpeg": "jpg",
		"image/png": "png",
		"image/gif": "gif",
		"image/webp": "webp",
	};
	return extensions[mimeType] || "png";
}

// Basic auth middleware
function validateBasicAuth(request: NextRequest) {
	const authHeader = request.headers.get("authorization");
	if (!authHeader || !authHeader.startsWith("Basic ")) {
		return false;
	}

	const base64Credentials = authHeader.split(" ")[1];
	const credentials = atob(base64Credentials);
	const [username, password] = credentials.split(":");

	return username === "active" && password === "chapter";
}

export async function PUT(request: NextRequest) {
	// Validate auth
	if (!validateBasicAuth(request)) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	try {
		const formData = await request.formData();
		const image = formData.get("image") as File | null;
		const width = formData.get("width") as string | null;
		const height = formData.get("height") as string | null;

		if (!image) {
			return new NextResponse("No image provided", { status: 400 });
		}

		const arrayBuffer = await image.arrayBuffer();
		const hash = await sha256(arrayBuffer);
		const extension = getExtension(image.type);

		// Generate key
		const key =
			width && height
				? `${hash}_${width}x${height}.${extension}`
				: `${hash}.${extension}`;

		// Upload to R2
		const r2 = await getR2();
		await r2.put(key, arrayBuffer, {
			httpMetadata: { contentType: image.type },
		});

		return new NextResponse(key);
	} catch (error) {
		console.error("Upload error:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

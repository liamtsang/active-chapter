// app/api/articles/route.ts
import { NextResponse } from "next/server";
import { getArticleLinksFresh } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const articles = await getArticleLinksFresh();
    return NextResponse.json(articles, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 },
    );
  }
}

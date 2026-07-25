import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { savedSandboxes } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const saved = await db
      .select()
      .from(savedSandboxes)
      .orderBy(desc(savedSandboxes.createdAt))
      .limit(50);
    return NextResponse.json({ status: "success", data: saved });
  } catch (error) {
    console.error("Failed to fetch saved sandboxes:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch saved sandboxes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, category, code } = await req.json();

    if (!title || !code) {
      return NextResponse.json(
        { status: "error", message: "Title and code are required" },
        { status: 400 }
      );
    }

    const inserted = await db
      .insert(savedSandboxes)
      .values({
        title,
        category: category || "js",
        code,
      })
      .returning();

    return NextResponse.json({ status: "success", data: inserted[0] });
  } catch (error) {
    console.error("Failed to save sandbox snippet:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to save sandbox snippet" },
      { status: 500 }
    );
  }
}

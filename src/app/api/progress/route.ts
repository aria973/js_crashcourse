import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userProgress } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allProgress = await db.select().from(userProgress);
    return NextResponse.json({ status: "success", data: allProgress });
  } catch (error) {
    console.error("Failed to fetch user progress:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lessonId, completed, leitnerBox, memoryStrength, quizScore } = body;

    if (!lessonId) {
      return NextResponse.json(
        { status: "error", message: "lessonId is required" },
        { status: 400 }
      );
    }

    // Check existing progress
    const existing = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.lessonId, lessonId));

    if (existing && existing.length > 0) {
      const updated = await db
        .update(userProgress)
        .set({
          completed: completed ?? existing[0].completed,
          leitnerBox: leitnerBox ?? existing[0].leitnerBox,
          memoryStrength: memoryStrength ?? existing[0].memoryStrength,
          quizScore: quizScore ?? existing[0].quizScore,
          lastReviewedAt: new Date(),
        })
        .where(eq(userProgress.lessonId, lessonId))
        .returning();

      return NextResponse.json({ status: "success", data: updated[0] });
    } else {
      const inserted = await db
        .insert(userProgress)
        .values({
          lessonId,
          completed: completed ?? true,
          leitnerBox: leitnerBox ?? 2,
          memoryStrength: memoryStrength ?? 40,
          quizScore: quizScore ?? 100,
          lastReviewedAt: new Date(),
        })
        .returning();

      return NextResponse.json({ status: "success", data: inserted[0] });
    }
  } catch (error) {
    console.error("Failed to save user progress:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to save progress" },
      { status: 500 }
    );
  }
}

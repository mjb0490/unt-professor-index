import { db } from "@/lib/db";
import { reviews, grades } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { courseId, content, difficulty, grade } = await req.json(); 
    const numericCourseId = Number(courseId);

    // 1. Insert Review
    const [newReview] = await db.insert(reviews).values({
      userId: session.user.id,
      courseId: numericCourseId,
      content,
      difficulty,
      grade: grade || null, 
    }).returning();

    // 2. Update Grade Stats
    if (grade && ['A', 'B', 'C', 'D', 'F'].includes(grade.toUpperCase())) {
      const column = grade.toLowerCase() as 'a' | 'b' | 'c' | 'd' | 'f';

      const updated = await db.update(grades)
        .set({
          [column]: sql`COALESCE(${grades[column]}, 0) + 1`,
          totalStudents: sql`COALESCE(${grades.totalStudents}, 0) + 1`,
        })
        .where(eq(grades.courseId, numericCourseId))
        .returning();

      if (updated.length === 0) {
        await db.insert(grades).values({
          courseId: numericCourseId,
          a: 0, b: 0, c: 0, d: 0, f: 0,
          [column]: 1,
          totalStudents: 1,
        });
      }
      
      // Clear all caches
      revalidatePath('/', 'layout');
    }

    return NextResponse.json(newReview);

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
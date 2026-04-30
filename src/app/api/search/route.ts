import { db } from "@/lib/db";
import { untCourses } from "@/db/schema";
import { ilike, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // 1. Extract query parameters from the URL
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("name") || "";
  const type = searchParams.get("type") || "professor";

  // If search term is too short, return empty array to save DB resources
  if (searchTerm.length < 1) {
    return NextResponse.json([]);
  }

  try {
    if (type === "professor") {
      // 2. Search by Professor Name
      const results = await db
        .select({
          id: untCourses.id,
          professorName: untCourses.professorName,
          department: untCourses.department,
        })
        .from(untCourses)
        .where(ilike(untCourses.professorName, `%${searchTerm}%`))
        // Limit results so the UI stays fast
        .limit(20);

      // Remove duplicates if the same professor appears for multiple courses
      const uniqueProfessors = results.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.professorName === value.professorName)
      );

      return NextResponse.json(uniqueProfessors);
    } else {
      // 3. Search by Course Code or Course Name
      const results = await db
        .select({
          id: untCourses.id,
          courseCode: untCourses.courseCode,
          courseName: untCourses.courseName,
        })
        .from(untCourses)
        .where(
          or(
            ilike(untCourses.courseCode, `%${searchTerm}%`),
            ilike(untCourses.courseName, `%${searchTerm}%`)
          )
        )
        .limit(50);

      return NextResponse.json(results);
    }
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
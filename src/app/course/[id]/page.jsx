export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { db } from "@/lib/db";
import { untCourses, grades } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import CourseProfileClient from "./CourseProfileClient";

// Helper for GPA to Letter Grade
const calculateLetter = (stats) => {
  if (!stats || stats.total === 0) return 'N/A';
  const gpa = ((stats.a * 4) + (stats.b * 3) + (stats.c * 2) + (stats.d * 1)) / stats.total;
  if (gpa >= 3.7) return 'A';
  if (gpa >= 3.3) return 'B+';
  if (gpa >= 3.0) return 'B';
  if (gpa >= 2.7) return 'B-';
  if (gpa >= 2.3) return 'C+';
  if (gpa >= 2.0) return 'C';
  return 'D';
};

export default async function CoursePage({ params }) {
  const { id } = await params;
  const baseCode = decodeURIComponent(id).replace(/-/g, ' ');

  const data = await db
    .select()
    .from(untCourses)
    .leftJoin(grades, eq(untCourses.id, grades.courseId))
    .where(sql`${untCourses.courseCode} LIKE ${baseCode + '%'}`);

  if (data.length === 0) return notFound();

  // 1. Initialize course-wide totals
  const courseInfo = {
    code: baseCode,
    name: data[0].unt_courses.courseName,
    department: data[0].unt_courses.department,
    totalStudents: 0,
    a: 0, b: 0, c: 0, d: 0, f: 0, total: 0 // For overall average
  };

  const profMap = new Map();

  data.forEach(({ unt_courses, grades: g }) => {
    const pName = unt_courses.professorName;
    if (!pName) return;

    if (!profMap.has(pName)) {
      profMap.set(pName, {
        name: pName,
        a: 0, b: 0, c: 0, d: 0, f: 0, total: 0
      });
    }

    const p = profMap.get(pName);
    if (g) {
      const sectionTotal = (g.a || 0) + (g.b || 0) + (g.c || 0) + (g.d || 0) + (g.f || 0);
      
      // Update Professor Stats
      p.a += (g.a || 0); p.b += (g.b || 0); p.c += (g.c || 0); p.d += (g.d || 0); p.f += (g.f || 0);
      p.total += sectionTotal;

      // 2. Update OVERALL Course Stats
      courseInfo.a += (g.a || 0);
      courseInfo.b += (g.b || 0);
      courseInfo.c += (g.c || 0);
      courseInfo.d += (g.d || 0);
      courseInfo.f += (g.f || 0);
      courseInfo.total += sectionTotal;
      courseInfo.totalStudents += sectionTotal;
    }
  });

  // 3. Calculate the true overall letter grade
  const overallAvg = calculateLetter(courseInfo);

  const professors = Array.from(profMap.values()).map(p => ({
    ...p,
    avgGrade: calculateLetter(p),
    gradeData: {
      A: p.total ? Math.round((p.a / p.total) * 100) : 0,
      B: p.total ? Math.round((p.b / p.total) * 100) : 0,
      C: p.total ? Math.round((p.c / p.total) * 100) : 0,
      D: p.total ? Math.round((p.d / p.total) * 100) : 0,
      F: p.total ? Math.round((p.f / p.total) * 100) : 0,
    }
  }));

  return (
    <CourseProfileClient 
      courseInfo={courseInfo} 
      professors={professors} 
      overallAvg={overallAvg} 
    />
  );
}
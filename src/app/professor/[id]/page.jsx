export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { db } from "@/lib/db";
import { untCourses, grades, reviews, user } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProfessorProfileClient from "./ProfessorProfileClient";

const calculateLetter = (stats) => {
  if (!stats || stats.total === 0) return 'N/A';
  
  // Calculate the actual GPA
  const gpa = ((stats.a * 4) + (stats.b * 3) + (stats.c * 2) + (stats.d * 1)) / stats.total;
  
  if (gpa >= 3.7) return 'A';
  if (gpa >= 3.3) return 'B+';
  if (gpa >= 3.0) return 'B';
  if (gpa >= 2.7) return 'B-';
  if (gpa >= 2.3) return 'C+';
  if (gpa >= 2.0) return 'C';
  if (gpa >= 1.0) return 'D'; // Now specifically checking for D (1.0 - 1.9)
  return 'F';                 // If GPA is below 1.0, it's an F
};

export default async function ProfessorPage({ params }) {
  const { id } = await params;
  const profName = decodeURIComponent(id).replace(/-/g, ' ');

  const data = await db
    .select()
    .from(untCourses)
    .leftJoin(grades, eq(untCourses.id, grades.courseId))
    .where(eq(untCourses.professorName, profName));

  if (data.length === 0) return notFound();

  // Find global metadata
  const contactInfo = data.find(d => d.unt_courses.education && d.unt_courses.email && d.unt_courses.email !== '')?.unt_courses || data[0].unt_courses;
  const sectionIds = data.map(d => d.unt_courses.id);

  // Calculate Overall Professor Stats
  const globalStats = { a: 0, b: 0, c: 0, d: 0, f: 0, total: 0 };
  data.forEach(({ grades: g }) => {
    if (g) {
      globalStats.a += Number(g.a || 0);
      globalStats.b += Number(g.b || 0);
      globalStats.c += Number(g.c || 0);
      globalStats.d += Number(g.d || 0);
      globalStats.f += Number(g.f || 0);
      globalStats.total += (Number(g.a || 0) + Number(g.b || 0) + Number(g.c || 0) + Number(g.d || 0) + Number(g.f || 0));
    }
  });

  const allReviews = await db
    .select({
      id: reviews.id,
      content: reviews.content,
      difficulty: reviews.difficulty,
      grade: reviews.grade,
      courseId: reviews.courseId,
      userName: user.name,
    })
    .from(reviews)
    .leftJoin(user, eq(reviews.userId, user.id))
    .where(inArray(reviews.courseId, sectionIds));

  const courseGroups = new Map();
  data.forEach(({ unt_courses, grades: g }) => {
    const baseCode = unt_courses.courseCode.split('.')[0];
    if (!courseGroups.has(baseCode)) {
      courseGroups.set(baseCode, {
        id: unt_courses.id,
        code: baseCode,
        name: unt_courses.courseName,
        a: 0, b: 0, c: 0, d: 0, f: 0, total: 0,
        sectionIds: []
      });
    }
    const group = courseGroups.get(baseCode);
    group.sectionIds.push(unt_courses.id);
    if (g) {
      group.a += Number(g.a || 0);
      group.b += Number(g.b || 0);
      group.c += Number(g.c || 0);
      group.d += Number(g.d || 0);
      group.f += Number(g.f || 0);
      group.total = group.a + group.b + group.c + group.d + group.f;
    }
  });

  const profStats = {
    name: profName,
    department: contactInfo.department,
    email: contactInfo.email || 'N/A',
    phone: contactInfo.phone || 'N/A',
    education: contactInfo.education || 'N/A',
    overallAvg: calculateLetter(globalStats),
    allSections: data.map(d => ({
      courseCode: d.unt_courses.courseCode,
      semester: d.unt_courses.semester,
      syllabusLink: d.unt_courses.syllabusLink
    })),
    aggregatedCourses: Array.from(courseGroups.values()).map(group => ({
      ...group,
      // FIXED: Calculating the average for this specific course
      avgGrade: calculateLetter(group), 
      comments: allReviews.filter(r => group.sectionIds.includes(r.courseId)),
      gradeData: { 
        A: group.total ? Math.round((group.a / group.total) * 100) : 0,
        B: group.total ? Math.round((group.b / group.total) * 100) : 0,
        C: group.total ? Math.round((group.c / group.total) * 100) : 0,
        D: group.total ? Math.round((group.d / group.total) * 100) : 0,
        F: group.total ? Math.round((group.f / group.total) * 100) : 0,
      }
    }))
  };

  return <ProfessorProfileClient professor={profStats} />;
}
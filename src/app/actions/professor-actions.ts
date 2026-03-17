'use server';

import { db } from '@/lib/db'; 
import { ilike, or } from 'drizzle-orm';
import { untCourses } from '@/db/schema';

export async function getProfessorsBySearch(searchTerm: string) {
    if (!searchTerm) return [];

    try {
        const results = await db.select().from(untCourses).where(
            or(
                ilike(untCourses.professorName, `%${searchTerm}%`),
                ilike(untCourses.courseName, `%${searchTerm}%`),
                ilike(untCourses.courseCode, `%${searchTerm}%`)
            )
        );        
        return results;
    } catch (error) {
        console.error("Search failed:", error);
        return [];
    }
}
'use server'; //keeps db pw hidden

import { db } from '@/lib/db'; 
import { ilike, or } from 'drizzle-orm';
import { unt_courses } from '@/db/schema';

export async function getProfessorsBySearch(searchTerm: string) {
    //return empty list when no user input
    if (!searchTerm) return [];

    try {
        //ask db for names/departments search match
        const results = await db.select().from(unt_courses).where(
            or(
                ilike(unt_courses.professorName, '%${searchTerm}%'),
                ilike(unt_courses.courseName, '%${searchTerm}%'),
                ilike(unt_courses.courseCode, '%${searchTerm}%')
            )
        );        
        return results;
    } catch (error) {
        console.error("Search failed:", error);
        return [];
    }
}
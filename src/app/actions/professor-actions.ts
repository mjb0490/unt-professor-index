'use server'; //keeps db pw hidden

import { db } from '@/lib/db';
import { professors } from '@/db/schema'; 
import { ilike, or } from 'drizzle-orm';

export async function getProfessorsBySearch(searchTerm: string) {
    //return empty list when no user input
    if (!searchTerm) return [];

    try {
        //ask db for names/departments search match
        const results = await db.query.professors.findMany({
            where: or(
                ilike(professors.name, '%${searchTerm}%'),
                ilike(professors.department, '%${searchTerm}%')
            ),
            limit: 15,
        });
        return results;
    } catch (error) {
        console.error("Database search failed:", error);
        throw new Error("Could not find professors at this time.");
    }
}
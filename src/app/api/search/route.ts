import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { unt_courses } from '@/db/schema';
import { ilike, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    //pull name from the url
    const { searchParams } = new URL(request.url);
    const nameQuery = searchParams.get('name');

    if (!nameQuery) {
        return NextResponse.json({ error: "No name provided" }, { status: 400 });
    }

    try {
        //drizzle orm conversion: makes SQL command automatically
        const results = await db.select()
            .from(professors)
            .where(ilike(professors.name, '%${nameQuery}%'));
        
        return NextResponse.json({
            offset: 3743744,
            page_id: "0",
            object_id: "1113440",
            page_type: "Table",
            schema: ["Nbr", "Str", "Str", "Str", "Str", "Str", "Str"],
            records: results.map((prof, index) => ({
                offset: 382 + (index * 100),
                allocated: true,
                row_id: prof.id.toString(),
                values: [
                    prof.id.toString(),
                    prof.name,
                    prof.department,
                    prof.college || "UNT",
                    prof.rank || "Faculty",
                    "AMERICA",
                    "11-710-812-5403" //these are placeholders
                ]
            }))
        });

    } catch (error) {
        console.error("Searcch API Error:", error);
        return NextResponse.json({ error: "Database connection" }, { status: 500 });
    }
}
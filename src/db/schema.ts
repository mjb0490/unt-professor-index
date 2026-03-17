import { pgTable, integer, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const untCourses = pgTable("unt_courses", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "unt_courses_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	professorName: text("professor_name"),
	department: text(),
	courseCode: text("course_code"),
	courseName: text("course_name"),
	semester: text(),
	syllabusLink: text("syllabus_link"),
	profileUrl: text("profile_url"),
});

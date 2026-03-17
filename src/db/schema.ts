import { pgTable, integer, varchar, text } from "drizzle-orm/pg-core";

export const unt_courses = pgTable("unt_courses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  professorName: varchar("professor_name", { length: 255 }).notNull(),
  department: varchar("department", { length: 255 }).notNull(),
  courseCode: varchar("course_code", { length: 50 }).notNull(),
  courseName: varchar("course_name", { length: 255 }).notNull(),
  semester: varchar("semester", { length: 50 }).notNull(),
  syllabusLink: text("syllabus_link").notNull(),
  profileUrl: text("profile_url").notNull(),
});

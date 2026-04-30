import { pgTable, integer, text, timestamp, boolean, numeric, serial } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const untCourses = pgTable("unt_courses", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity({ 
        name: "unt_courses_id_seq", 
        startWith: 1, 
        increment: 1 
    }),
    professorName: text("professor_name"),
    department: text("department"),
    college: text("college"),
    courseCode: text("course_code"),
    courseName: text("course_name"),
    semester: text("semester"),
    syllabusLink: text("syllabus_link"),
    profileUrl: text("profile_url"),
    // New columns added through Drizzle
    email: text("email"),
    phone: text("phone"),
    education: text("education"),
});

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("emailVerified").notNull(),
    image: text("image"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId").notNull().references(() => user.id),
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId").notNull().references(() => user.id),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt"),
    updatedAt: timestamp("updatedAt"),
});

export const grades = pgTable("grades", {
    // Using serial here (and added it to the imports above)
    id: serial("id").primaryKey(),
    courseId: integer("course_id").references(() => untCourses.id),
    
    a: integer("a").default(0),
    b: integer("b").default(0),
    c: integer("c").default(0),
    d: integer("d").default(0),
    f: integer("f").default(0),

    totalStudents: integer("total_students").default(0),
    averageGpa: numeric("average_gpa", { precision: 3, scale: 2 }),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  courseId: integer("course_id").notNull().references(() => untCourses.id),
  content: text("content").notNull(),
  difficulty: text("difficulty").notNull(),
  grade: text("grade"), // Optional: can be NULL
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
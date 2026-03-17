CREATE TABLE "unt_courses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "unt_courses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"professor_name" varchar(255) NOT NULL,
	"department" varchar(255) NOT NULL,
	"course_code" varchar(50) NOT NULL,
	"course_name" varchar(255) NOT NULL,
	"semester" varchar(50) NOT NULL,
	"syllabus_link" text NOT NULL,
	"profile_url" text NOT NULL
);

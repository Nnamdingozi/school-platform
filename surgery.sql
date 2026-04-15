-- Target only the tables we want to recreate
DROP TABLE IF EXISTS "public"."QuizQuestion" CASCADE;
DROP TABLE IF EXISTS "public"."Quiz" CASCADE;
DROP TABLE IF EXISTS "public"."Lesson" CASCADE;
-- Clear any "ghost" versions of the new tables
DROP TABLE IF EXISTS "public"."GlobalLesson" CASCADE;
DROP TABLE IF EXISTS "public"."SchoolLesson" CASCADE;
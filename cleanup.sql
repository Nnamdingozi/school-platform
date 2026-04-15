-- Disable timeout for this specific run
SET statement_timeout = 0;

-- Drop the old tables that are causing the foreign key conflict
-- We use CASCADE to force the database to remove the old relations
DROP TABLE IF EXISTS "public"."Lesson" CASCADE;
DROP TABLE IF EXISTS "public"."Quiz" CASCADE;
DROP TABLE IF EXISTS "public"."QuizQuestion" CASCADE;

-- If you already tried to push and it partially created the new tables, drop them too to be safe
DROP TABLE IF EXISTS "public"."GlobalLesson" CASCADE;
DROP TABLE IF EXISTS "public"."SchoolLesson" CASCADE;
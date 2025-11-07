-- Apply migration to add sequence for cooked.id
CREATE SEQUENCE IF NOT EXISTS "cooked_id_seq";
ALTER TABLE "cooked" ALTER COLUMN "id" SET DEFAULT nextval('cooked_id_seq');
SELECT setval('cooked_id_seq', COALESCE((SELECT MAX(id) FROM "cooked"), 0) + 1, false);
ALTER SEQUENCE "cooked_id_seq" OWNED BY "cooked"."id";

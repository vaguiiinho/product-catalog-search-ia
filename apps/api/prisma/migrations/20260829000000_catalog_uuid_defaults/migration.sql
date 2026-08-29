CREATE TEMP TABLE product_id_migration AS
SELECT "id" AS old_id, gen_random_uuid()::text AS new_id
FROM "Product"
WHERE "id" !~* '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';

UPDATE semantic_documents document
SET product_id = migration.new_id
FROM product_id_migration migration
WHERE document.product_id = migration.old_id;

UPDATE "Category" SET "id" = gen_random_uuid()::text
WHERE "id" !~* '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';

UPDATE "Product" product SET "id" = migration.new_id
FROM product_id_migration migration
WHERE product."id" = migration.old_id;

UPDATE "ProductAttribute" SET "id" = gen_random_uuid()::text
WHERE "id" !~* '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';

UPDATE "ProductImage" SET "id" = gen_random_uuid()::text
WHERE "id" !~* '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';

ALTER TABLE "Product" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;
ALTER TABLE "Category" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;
ALTER TABLE "ProductAttribute" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;
ALTER TABLE "ProductImage" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

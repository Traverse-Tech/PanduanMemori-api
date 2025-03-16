/*
  Warnings:

  - The values [LATER] on the enum `DementiaStage` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DementiaStage_new" AS ENUM ('EARLY', 'MIDDLE', 'LATE');
ALTER TABLE "Patient" ALTER COLUMN "dementia_stage" TYPE "DementiaStage_new" USING ("dementia_stage"::text::"DementiaStage_new");
ALTER TYPE "DementiaStage" RENAME TO "DementiaStage_old";
ALTER TYPE "DementiaStage_new" RENAME TO "DementiaStage";
DROP TYPE "DementiaStage_old";
COMMIT;

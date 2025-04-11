-- AlterTable
ALTER TABLE "ActivityOccurence" ADD COLUMN     "actual_start_time" TIMESTAMPTZ,
ADD COLUMN     "end_time" TIMESTAMPTZ,
ADD COLUMN     "is_on_time" BOOLEAN NOT NULL DEFAULT false;

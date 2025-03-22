-- AlterTable
ALTER TABLE "Recurrence" ADD COLUMN     "week_days" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

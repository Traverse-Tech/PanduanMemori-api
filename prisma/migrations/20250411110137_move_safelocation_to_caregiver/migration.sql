/*
  Warnings:

  - You are about to drop the column `address_id` on the `Caregiver` table. All the data in the column will be lost.
  - You are about to drop the column `safe_location_id` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the `LocationCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PatientImportantLocation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `safe_location_id` to the `Caregiver` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Caregiver" DROP CONSTRAINT "Caregiver_address_id_fkey";

-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_safe_location_id_fkey";

-- DropForeignKey
ALTER TABLE "PatientImportantLocation" DROP CONSTRAINT "PatientImportantLocation_address_id_fkey";

-- DropForeignKey
ALTER TABLE "PatientImportantLocation" DROP CONSTRAINT "PatientImportantLocation_location_category_id_fkey";

-- DropForeignKey
ALTER TABLE "PatientImportantLocation" DROP CONSTRAINT "PatientImportantLocation_patient_id_fkey";

-- DropIndex
DROP INDEX "Caregiver_address_id_idx";

-- DropIndex
DROP INDEX "Patient_safe_location_id_idx";

-- AlterTable
ALTER TABLE "Caregiver" DROP COLUMN "address_id",
ADD COLUMN     "safe_location_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "safe_location_id";

-- DropTable
DROP TABLE "LocationCategory";

-- DropTable
DROP TABLE "PatientImportantLocation";

-- CreateIndex
CREATE INDEX "Caregiver_safe_location_id_idx" ON "Caregiver"("safe_location_id");

-- AddForeignKey
ALTER TABLE "Caregiver" ADD CONSTRAINT "Caregiver_safe_location_id_fkey" FOREIGN KEY ("safe_location_id") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `patient_id` on the `Caregiver` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Caregiver" DROP CONSTRAINT "Caregiver_patient_id_fkey";

-- DropIndex
DROP INDEX "Caregiver_patient_id_address_id_idx";

-- AlterTable
ALTER TABLE "Caregiver" DROP COLUMN "patient_id";

-- CreateTable
CREATE TABLE "PatientCaregiver" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "caregiver_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "PatientCaregiver_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PatientCaregiver_patient_id_caregiver_id_is_deleted_idx" ON "PatientCaregiver"("patient_id", "caregiver_id", "is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "PatientCaregiver_patient_id_caregiver_id_key" ON "PatientCaregiver"("patient_id", "caregiver_id");

-- CreateIndex
CREATE INDEX "Caregiver_address_id_idx" ON "Caregiver"("address_id");

-- AddForeignKey
ALTER TABLE "PatientCaregiver" ADD CONSTRAINT "PatientCaregiver_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientCaregiver" ADD CONSTRAINT "PatientCaregiver_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "Caregiver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

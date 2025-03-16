-- DropForeignKey
ALTER TABLE "Caregiver" DROP CONSTRAINT "Caregiver_patient_id_fkey";

-- AlterTable
ALTER TABLE "Caregiver" ALTER COLUMN "patient_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Caregiver" ADD CONSTRAINT "Caregiver_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

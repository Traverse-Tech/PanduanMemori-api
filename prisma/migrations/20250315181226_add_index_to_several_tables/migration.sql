-- DropIndex
DROP INDEX "Activity_patient_id_is_deleted_idx";

-- DropIndex
DROP INDEX "ActivityOccurence_activity_id_datetime_is_deleted_idx";

-- DropIndex
DROP INDEX "Caregiver_patient_id_idx";

-- DropIndex
DROP INDEX "PatientImportantLocation_patient_id_is_deleted_idx";

-- DropIndex
DROP INDEX "QuizQuestion_quiz_id_order_is_deleted_idx";

-- DropIndex
DROP INDEX "WeeklySummary_is_deleted_idx";

-- CreateIndex
CREATE INDEX "Activity_patient_id_activity_category_id_is_deleted_idx" ON "Activity"("patient_id", "activity_category_id", "is_deleted");

-- CreateIndex
CREATE INDEX "ActivityOccurence_activity_id_recurrence_id_datetime_is_del_idx" ON "ActivityOccurence"("activity_id", "recurrence_id", "datetime", "is_deleted");

-- CreateIndex
CREATE INDEX "Caregiver_patient_id_address_id_idx" ON "Caregiver"("patient_id", "address_id");

-- CreateIndex
CREATE INDEX "Patient_safe_location_id_idx" ON "Patient"("safe_location_id");

-- CreateIndex
CREATE INDEX "PatientImportantLocation_patient_id_address_id_location_cat_idx" ON "PatientImportantLocation"("patient_id", "address_id", "location_category_id", "is_deleted");

-- CreateIndex
CREATE INDEX "QuizQuestion_quiz_id_order_next_question_id_is_deleted_idx" ON "QuizQuestion"("quiz_id", "order", "next_question_id", "is_deleted");

-- CreateIndex
CREATE INDEX "WeeklySummary_patient_id_start_date_end_date_is_deleted_idx" ON "WeeklySummary"("patient_id", "start_date", "end_date", "is_deleted");

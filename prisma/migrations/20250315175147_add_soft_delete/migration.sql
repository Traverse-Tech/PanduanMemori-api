-- DropIndex
DROP INDEX "Activity_patientId_idx";

-- DropIndex
DROP INDEX "ActivityOccurence_activityId_datetime_idx";

-- DropIndex
DROP INDEX "BuddyConversation_patientId_idx";

-- DropIndex
DROP INDEX "EmergencyLog_patientId_idx";

-- DropIndex
DROP INDEX "PatientImportantLocation_patientId_idx";

-- DropIndex
DROP INDEX "QuizQuestion_quizId_order_idx";

-- DropIndex
DROP INDEX "QuizQuestionOption_questionId_idx";

-- DropIndex
DROP INDEX "User_email_registrationNumber_idx";

-- DropIndex
DROP INDEX "UserQuizAnswer_progressId_questionId_selectedOptionId_idx";

-- DropIndex
DROP INDEX "UserQuizProgress_patientId_quizId_isCompleted_score_idx";

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "deletedAt" TIMESTAMPTZ,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ActivityCategory" ADD COLUMN     "deletedAt" TIMESTAMPTZ,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ActivityOccurence" ADD COLUMN     "deletedAt" TIMESTAMPTZ,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "deletedAt" TIMESTAMPTZ,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "BuddyConversation" ADD COLUMN     "deletedAt" TIMESTAMPTZ,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "EmergencyLog" ADD COLUMN     "deletedAt" TIMESTAMPTZ,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "LocationCategory" ADD COLUMN     "deletedAt" TIMESTAMPTZ,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PatientImportantLocation" ADD COLUMN     "deletedAt" TIMESTAMPTZ,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "deletedAt" TIMESTAMPTZ,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN     "deletedAt" TIMESTAMPTZ,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "QuizQuestionOption" ADD COLUMN     "deletedAt" TIMESTAMPTZ,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Recurrence" ADD COLUMN     "deletedAt" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMPTZ,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserQuizAnswer" ADD COLUMN     "deletedAt" TIMESTAMPTZ,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserQuizProgress" ADD COLUMN     "deletedAt" TIMESTAMPTZ,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "WeeklySummary" ADD COLUMN     "deletedAt" TIMESTAMPTZ,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Activity_patientId_isDeleted_idx" ON "Activity"("patientId", "isDeleted");

-- CreateIndex
CREATE INDEX "ActivityCategory_isDeleted_idx" ON "ActivityCategory"("isDeleted");

-- CreateIndex
CREATE INDEX "ActivityOccurence_activityId_datetime_isDeleted_idx" ON "ActivityOccurence"("activityId", "datetime", "isDeleted");

-- CreateIndex
CREATE INDEX "Address_isDeleted_idx" ON "Address"("isDeleted");

-- CreateIndex
CREATE INDEX "BuddyConversation_patientId_isDeleted_idx" ON "BuddyConversation"("patientId", "isDeleted");

-- CreateIndex
CREATE INDEX "EmergencyLog_patientId_isDeleted_idx" ON "EmergencyLog"("patientId", "isDeleted");

-- CreateIndex
CREATE INDEX "LocationCategory_isDeleted_idx" ON "LocationCategory"("isDeleted");

-- CreateIndex
CREATE INDEX "PatientImportantLocation_patientId_isDeleted_idx" ON "PatientImportantLocation"("patientId", "isDeleted");

-- CreateIndex
CREATE INDEX "Quiz_isDeleted_idx" ON "Quiz"("isDeleted");

-- CreateIndex
CREATE INDEX "QuizQuestion_quizId_order_isDeleted_idx" ON "QuizQuestion"("quizId", "order", "isDeleted");

-- CreateIndex
CREATE INDEX "QuizQuestionOption_questionId_isDeleted_idx" ON "QuizQuestionOption"("questionId", "isDeleted");

-- CreateIndex
CREATE INDEX "User_email_registrationNumber_isDeleted_idx" ON "User"("email", "registrationNumber", "isDeleted");

-- CreateIndex
CREATE INDEX "UserQuizAnswer_progressId_questionId_selectedOptionId_isDel_idx" ON "UserQuizAnswer"("progressId", "questionId", "selectedOptionId", "isDeleted");

-- CreateIndex
CREATE INDEX "UserQuizProgress_patientId_quizId_isCompleted_isDeleted_idx" ON "UserQuizProgress"("patientId", "quizId", "isCompleted", "isDeleted");

-- CreateIndex
CREATE INDEX "WeeklySummary_isDeleted_idx" ON "WeeklySummary"("isDeleted");

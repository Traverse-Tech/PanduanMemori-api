/*
  Warnings:

  - You are about to drop the column `activityCategoryId` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ActivityCategory` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `ActivityCategory` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `ActivityCategory` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ActivityCategory` table. All the data in the column will be lost.
  - You are about to drop the column `activityId` on the `ActivityOccurence` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ActivityOccurence` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `ActivityOccurence` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `ActivityOccurence` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `ActivityOccurence` table. All the data in the column will be lost.
  - You are about to drop the column `recurrenceId` on the `ActivityOccurence` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ActivityOccurence` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `answerAudioFile` on the `BuddyConversation` table. All the data in the column will be lost.
  - You are about to drop the column `audioFile` on the `BuddyConversation` table. All the data in the column will be lost.
  - You are about to drop the column `audioTranscript` on the `BuddyConversation` table. All the data in the column will be lost.
  - You are about to drop the column `audioTranscriptJson` on the `BuddyConversation` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `BuddyConversation` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `BuddyConversation` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `BuddyConversation` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `BuddyConversation` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `BuddyConversation` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `Caregiver` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `Caregiver` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `EmergencyLog` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `EmergencyLog` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `EmergencyLog` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `EmergencyLog` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `EmergencyLog` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `LocationCategory` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `LocationCategory` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `LocationCategory` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `LocationCategory` table. All the data in the column will be lost.
  - You are about to drop the column `dementiaStage` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `safeLocationId` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `PatientImportantLocation` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `PatientImportantLocation` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `PatientImportantLocation` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `PatientImportantLocation` table. All the data in the column will be lost.
  - You are about to drop the column `locationCategoryId` on the `PatientImportantLocation` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `PatientImportantLocation` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `PatientImportantLocation` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `nextQuestionId` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `quizId` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `QuizQuestionOption` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `QuizQuestionOption` table. All the data in the column will be lost.
  - You are about to drop the column `isAnswer` on the `QuizQuestionOption` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `QuizQuestionOption` table. All the data in the column will be lost.
  - You are about to drop the column `questionId` on the `QuizQuestionOption` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `QuizQuestionOption` table. All the data in the column will be lost.
  - You are about to drop the column `activityId` on the `Recurrence` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Recurrence` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Recurrence` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Recurrence` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Recurrence` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Recurrence` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Recurrence` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `registrationNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `UserQuizAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `UserQuizAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `UserQuizAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `progressId` on the `UserQuizAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `questionId` on the `UserQuizAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `selectedOptionId` on the `UserQuizAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserQuizAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `UserQuizProgress` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `UserQuizProgress` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `UserQuizProgress` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `UserQuizProgress` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `UserQuizProgress` table. All the data in the column will be lost.
  - You are about to drop the column `quizId` on the `UserQuizProgress` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserQuizProgress` table. All the data in the column will be lost.
  - You are about to drop the column `blacklistedAt` on the `UserToken` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `UserToken` table. All the data in the column will be lost.
  - You are about to drop the column `deactivatedAfter` on the `UserToken` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserToken` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserToken` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `WeeklySummary` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `WeeklySummary` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `WeeklySummary` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `WeeklySummary` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `WeeklySummary` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `WeeklySummary` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `WeeklySummary` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[next_question_id]` on the table `QuizQuestion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[registration_number]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `activity_category_id` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patient_id` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ActivityCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activity_id` to the `ActivityOccurence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ActivityOccurence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audio_transcript` to the `BuddyConversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audio_transcript_json` to the `BuddyConversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patient_id` to the `BuddyConversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `BuddyConversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address_id` to the `Caregiver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patient_id` to the `Caregiver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patient_id` to the `EmergencyLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `EmergencyLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `LocationCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `safe_location_id` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address_id` to the `PatientImportantLocation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location_category_id` to the `PatientImportantLocation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patient_id` to the `PatientImportantLocation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `PatientImportantLocation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quiz_id` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_id` to the `QuizQuestionOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `QuizQuestionOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activity_id` to the `Recurrence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Recurrence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `progress_id` to the `UserQuizAnswer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_id` to the `UserQuizAnswer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selected_option_id` to the `UserQuizAnswer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `UserQuizAnswer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patient_id` to the `UserQuizProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quiz_id` to the `UserQuizProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `UserQuizProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deactivated_after` to the `UserToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `UserToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `UserToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_date` to the `WeeklySummary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patient_id` to the `WeeklySummary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `WeeklySummary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `WeeklySummary` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_activityCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_patientId_fkey";

-- DropForeignKey
ALTER TABLE "ActivityOccurence" DROP CONSTRAINT "ActivityOccurence_activityId_fkey";

-- DropForeignKey
ALTER TABLE "ActivityOccurence" DROP CONSTRAINT "ActivityOccurence_recurrenceId_fkey";

-- DropForeignKey
ALTER TABLE "BuddyConversation" DROP CONSTRAINT "BuddyConversation_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Caregiver" DROP CONSTRAINT "Caregiver_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Caregiver" DROP CONSTRAINT "Caregiver_patientId_fkey";

-- DropForeignKey
ALTER TABLE "EmergencyLog" DROP CONSTRAINT "EmergencyLog_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_safeLocationId_fkey";

-- DropForeignKey
ALTER TABLE "PatientImportantLocation" DROP CONSTRAINT "PatientImportantLocation_addressId_fkey";

-- DropForeignKey
ALTER TABLE "PatientImportantLocation" DROP CONSTRAINT "PatientImportantLocation_locationCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "PatientImportantLocation" DROP CONSTRAINT "PatientImportantLocation_patientId_fkey";

-- DropForeignKey
ALTER TABLE "QuizQuestion" DROP CONSTRAINT "QuizQuestion_nextQuestionId_fkey";

-- DropForeignKey
ALTER TABLE "QuizQuestion" DROP CONSTRAINT "QuizQuestion_quizId_fkey";

-- DropForeignKey
ALTER TABLE "QuizQuestionOption" DROP CONSTRAINT "QuizQuestionOption_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Recurrence" DROP CONSTRAINT "Recurrence_activityId_fkey";

-- DropForeignKey
ALTER TABLE "UserQuizAnswer" DROP CONSTRAINT "UserQuizAnswer_progressId_fkey";

-- DropForeignKey
ALTER TABLE "UserQuizAnswer" DROP CONSTRAINT "UserQuizAnswer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "UserQuizAnswer" DROP CONSTRAINT "UserQuizAnswer_selectedOptionId_fkey";

-- DropForeignKey
ALTER TABLE "UserQuizProgress" DROP CONSTRAINT "UserQuizProgress_patientId_fkey";

-- DropForeignKey
ALTER TABLE "UserQuizProgress" DROP CONSTRAINT "UserQuizProgress_quizId_fkey";

-- DropForeignKey
ALTER TABLE "UserToken" DROP CONSTRAINT "UserToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "WeeklySummary" DROP CONSTRAINT "WeeklySummary_patientId_fkey";

-- DropIndex
DROP INDEX "Activity_patientId_isDeleted_idx";

-- DropIndex
DROP INDEX "ActivityCategory_isDeleted_idx";

-- DropIndex
DROP INDEX "ActivityOccurence_activityId_datetime_isDeleted_idx";

-- DropIndex
DROP INDEX "Address_isDeleted_idx";

-- DropIndex
DROP INDEX "BuddyConversation_patientId_isDeleted_idx";

-- DropIndex
DROP INDEX "Caregiver_patientId_idx";

-- DropIndex
DROP INDEX "EmergencyLog_patientId_isDeleted_idx";

-- DropIndex
DROP INDEX "LocationCategory_isDeleted_idx";

-- DropIndex
DROP INDEX "PatientImportantLocation_patientId_isDeleted_idx";

-- DropIndex
DROP INDEX "Quiz_isDeleted_idx";

-- DropIndex
DROP INDEX "QuizQuestion_nextQuestionId_key";

-- DropIndex
DROP INDEX "QuizQuestion_quizId_order_isDeleted_idx";

-- DropIndex
DROP INDEX "QuizQuestionOption_questionId_isDeleted_idx";

-- DropIndex
DROP INDEX "Recurrence_activityId_isDeleted_idx";

-- DropIndex
DROP INDEX "User_email_registrationNumber_isDeleted_idx";

-- DropIndex
DROP INDEX "User_phoneNumber_key";

-- DropIndex
DROP INDEX "User_registrationNumber_key";

-- DropIndex
DROP INDEX "UserQuizAnswer_progressId_questionId_selectedOptionId_isDel_idx";

-- DropIndex
DROP INDEX "UserQuizProgress_patientId_quizId_isCompleted_isDeleted_idx";

-- DropIndex
DROP INDEX "UserToken_userId_status_idx";

-- DropIndex
DROP INDEX "WeeklySummary_isDeleted_idx";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "activityCategoryId",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "isDeleted",
DROP COLUMN "patientId",
DROP COLUMN "updatedAt",
ADD COLUMN     "activity_category_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "patient_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "ActivityCategory" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "isDeleted",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "ActivityOccurence" DROP COLUMN "activityId",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "isCompleted",
DROP COLUMN "isDeleted",
DROP COLUMN "recurrenceId",
DROP COLUMN "updatedAt",
ADD COLUMN     "activity_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recurrence_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "isDeleted",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "BuddyConversation" DROP COLUMN "answerAudioFile",
DROP COLUMN "audioFile",
DROP COLUMN "audioTranscript",
DROP COLUMN "audioTranscriptJson",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "isDeleted",
DROP COLUMN "patientId",
DROP COLUMN "updatedAt",
ADD COLUMN     "answer_audio_file" TEXT,
ADD COLUMN     "audio_file" TEXT,
ADD COLUMN     "audio_transcript" TEXT NOT NULL,
ADD COLUMN     "audio_transcript_json" JSONB NOT NULL,
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "patient_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "Caregiver" DROP COLUMN "addressId",
DROP COLUMN "patientId",
ADD COLUMN     "address_id" TEXT NOT NULL,
ADD COLUMN     "patient_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EmergencyLog" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "isDeleted",
DROP COLUMN "patientId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "patient_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "LocationCategory" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "isDeleted",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "dementiaStage",
DROP COLUMN "safeLocationId",
ADD COLUMN     "dementia_stage" "DementiaStage",
ADD COLUMN     "safe_location_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PatientImportantLocation" DROP COLUMN "addressId",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "isDeleted",
DROP COLUMN "locationCategoryId",
DROP COLUMN "patientId",
DROP COLUMN "updatedAt",
ADD COLUMN     "address_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "location_category_id" TEXT NOT NULL,
ADD COLUMN     "patient_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "isDeleted",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "QuizQuestion" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "isDeleted",
DROP COLUMN "nextQuestionId",
DROP COLUMN "quizId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "next_question_id" TEXT,
ADD COLUMN     "quiz_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "QuizQuestionOption" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "isAnswer",
DROP COLUMN "isDeleted",
DROP COLUMN "questionId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_answer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "question_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "Recurrence" DROP COLUMN "activityId",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "endDate",
DROP COLUMN "isDeleted",
DROP COLUMN "startDate",
DROP COLUMN "updatedAt",
ADD COLUMN     "activity_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "end_date" DATE,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "start_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "isDeleted",
DROP COLUMN "phoneNumber",
DROP COLUMN "registrationNumber",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone_number" VARCHAR(16) NOT NULL,
ADD COLUMN     "registration_number" VARCHAR(16),
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "UserQuizAnswer" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "isDeleted",
DROP COLUMN "progressId",
DROP COLUMN "questionId",
DROP COLUMN "selectedOptionId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "progress_id" TEXT NOT NULL,
ADD COLUMN     "question_id" TEXT NOT NULL,
ADD COLUMN     "selected_option_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "UserQuizProgress" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "isCompleted",
DROP COLUMN "isDeleted",
DROP COLUMN "patientId",
DROP COLUMN "quizId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "patient_id" TEXT NOT NULL,
ADD COLUMN     "quiz_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "UserToken" DROP COLUMN "blacklistedAt",
DROP COLUMN "createdAt",
DROP COLUMN "deactivatedAfter",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "blacklisted_at" TIMESTAMPTZ,
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deactivated_after" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WeeklySummary" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "endDate",
DROP COLUMN "isDeleted",
DROP COLUMN "patientId",
DROP COLUMN "startDate",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "end_date" DATE NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "patient_id" TEXT NOT NULL,
ADD COLUMN     "start_date" DATE NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;

-- CreateIndex
CREATE INDEX "Activity_patient_id_is_deleted_idx" ON "Activity"("patient_id", "is_deleted");

-- CreateIndex
CREATE INDEX "ActivityCategory_is_deleted_idx" ON "ActivityCategory"("is_deleted");

-- CreateIndex
CREATE INDEX "ActivityOccurence_activity_id_datetime_is_deleted_idx" ON "ActivityOccurence"("activity_id", "datetime", "is_deleted");

-- CreateIndex
CREATE INDEX "Address_is_deleted_idx" ON "Address"("is_deleted");

-- CreateIndex
CREATE INDEX "BuddyConversation_patient_id_is_deleted_idx" ON "BuddyConversation"("patient_id", "is_deleted");

-- CreateIndex
CREATE INDEX "Caregiver_patient_id_idx" ON "Caregiver"("patient_id");

-- CreateIndex
CREATE INDEX "EmergencyLog_patient_id_is_deleted_idx" ON "EmergencyLog"("patient_id", "is_deleted");

-- CreateIndex
CREATE INDEX "LocationCategory_is_deleted_idx" ON "LocationCategory"("is_deleted");

-- CreateIndex
CREATE INDEX "PatientImportantLocation_patient_id_is_deleted_idx" ON "PatientImportantLocation"("patient_id", "is_deleted");

-- CreateIndex
CREATE INDEX "Quiz_is_deleted_idx" ON "Quiz"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "QuizQuestion_next_question_id_key" ON "QuizQuestion"("next_question_id");

-- CreateIndex
CREATE INDEX "QuizQuestion_quiz_id_order_is_deleted_idx" ON "QuizQuestion"("quiz_id", "order", "is_deleted");

-- CreateIndex
CREATE INDEX "QuizQuestionOption_question_id_is_deleted_idx" ON "QuizQuestionOption"("question_id", "is_deleted");

-- CreateIndex
CREATE INDEX "Recurrence_activity_id_is_deleted_idx" ON "Recurrence"("activity_id", "is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_number_key" ON "User"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "User_registration_number_key" ON "User"("registration_number");

-- CreateIndex
CREATE INDEX "User_email_registration_number_is_deleted_idx" ON "User"("email", "registration_number", "is_deleted");

-- CreateIndex
CREATE INDEX "UserQuizAnswer_progress_id_question_id_selected_option_id_i_idx" ON "UserQuizAnswer"("progress_id", "question_id", "selected_option_id", "is_deleted");

-- CreateIndex
CREATE INDEX "UserQuizProgress_patient_id_quiz_id_is_completed_is_deleted_idx" ON "UserQuizProgress"("patient_id", "quiz_id", "is_completed", "is_deleted");

-- CreateIndex
CREATE INDEX "UserToken_user_id_status_idx" ON "UserToken"("user_id", "status");

-- CreateIndex
CREATE INDEX "WeeklySummary_is_deleted_idx" ON "WeeklySummary"("is_deleted");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_activity_category_id_fkey" FOREIGN KEY ("activity_category_id") REFERENCES "ActivityCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recurrence" ADD CONSTRAINT "Recurrence_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityOccurence" ADD CONSTRAINT "ActivityOccurence_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityOccurence" ADD CONSTRAINT "ActivityOccurence_recurrence_id_fkey" FOREIGN KEY ("recurrence_id") REFERENCES "Recurrence"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientImportantLocation" ADD CONSTRAINT "PatientImportantLocation_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientImportantLocation" ADD CONSTRAINT "PatientImportantLocation_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientImportantLocation" ADD CONSTRAINT "PatientImportantLocation_location_category_id_fkey" FOREIGN KEY ("location_category_id") REFERENCES "LocationCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_safe_location_id_fkey" FOREIGN KEY ("safe_location_id") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caregiver" ADD CONSTRAINT "Caregiver_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caregiver" ADD CONSTRAINT "Caregiver_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToken" ADD CONSTRAINT "UserToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuddyConversation" ADD CONSTRAINT "BuddyConversation_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyLog" ADD CONSTRAINT "EmergencyLog_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_next_question_id_fkey" FOREIGN KEY ("next_question_id") REFERENCES "QuizQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestionOption" ADD CONSTRAINT "QuizQuestionOption_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "QuizQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuizProgress" ADD CONSTRAINT "UserQuizProgress_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuizProgress" ADD CONSTRAINT "UserQuizProgress_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuizAnswer" ADD CONSTRAINT "UserQuizAnswer_progress_id_fkey" FOREIGN KEY ("progress_id") REFERENCES "UserQuizProgress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuizAnswer" ADD CONSTRAINT "UserQuizAnswer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "QuizQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuizAnswer" ADD CONSTRAINT "UserQuizAnswer_selected_option_id_fkey" FOREIGN KEY ("selected_option_id") REFERENCES "QuizQuestionOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklySummary" ADD CONSTRAINT "WeeklySummary_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[activity_id,datetime]` on the table `ActivityOccurence` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ActivityOccurence_activity_id_datetime_key" ON "ActivityOccurence"("activity_id", "datetime");

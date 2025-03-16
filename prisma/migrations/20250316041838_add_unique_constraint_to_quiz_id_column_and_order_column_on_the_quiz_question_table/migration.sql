/*
  Warnings:

  - A unique constraint covering the columns `[quiz_id,order]` on the table `QuizQuestion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "QuizQuestion_quiz_id_order_key" ON "QuizQuestion"("quiz_id", "order");

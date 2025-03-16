/*
  Warnings:

  - A unique constraint covering the columns `[longitude]` on the table `Address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[latitude]` on the table `Address` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Address_longitude_key" ON "Address"("longitude");

-- CreateIndex
CREATE UNIQUE INDEX "Address_latitude_key" ON "Address"("latitude");

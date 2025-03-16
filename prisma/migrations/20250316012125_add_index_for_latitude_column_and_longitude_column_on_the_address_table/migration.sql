/*
  Warnings:

  - A unique constraint covering the columns `[longitude,latitude]` on the table `Address` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Address_is_deleted_idx";

-- DropIndex
DROP INDEX "Address_latitude_key";

-- DropIndex
DROP INDEX "Address_longitude_key";

-- CreateIndex
CREATE INDEX "Address_longitude_latitude_is_deleted_idx" ON "Address"("longitude", "latitude", "is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "Address_longitude_latitude_key" ON "Address"("longitude", "latitude");

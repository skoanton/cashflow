/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalId` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "externalId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Account_externalId_key" ON "Account"("externalId");

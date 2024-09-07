/*
  Warnings:

  - Made the column `budgetId` on table `Account` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "budgetId" SET NOT NULL;

/*
  Warnings:

  - You are about to drop the column `deleted` on the `BudgetCategory` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `BudgetItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BudgetCategory" DROP COLUMN "deleted";

-- AlterTable
ALTER TABLE "BudgetItem" DROP COLUMN "deleted";

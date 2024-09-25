/*
  Warnings:

  - You are about to drop the column `order` on the `BudgetCategory` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `BudgetItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BudgetCategory" DROP COLUMN "order";

-- AlterTable
ALTER TABLE "BudgetItem" DROP COLUMN "order";

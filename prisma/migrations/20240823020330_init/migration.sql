/*
  Warnings:

  - Added the required column `userId` to the `BudgetCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `BudgetItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "BudgetCategory" ADD COLUMN     "userId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "BudgetItem" ADD COLUMN     "userId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "userId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "BudgetCategory" ADD CONSTRAINT "BudgetCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetItem" ADD CONSTRAINT "BudgetItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

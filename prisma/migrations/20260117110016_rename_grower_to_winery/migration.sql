/*
  Warnings:

  - You are about to drop the column `growerId` on the `Wine` table. All the data in the column will be lost.
  - Added the required column `wineryId` to the `Wine` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Wine" DROP CONSTRAINT "Wine_growerId_fkey";

-- DropIndex
DROP INDEX "Wine_growerId_idx";

-- AlterTable
ALTER TABLE "Wine" DROP COLUMN "growerId",
ADD COLUMN     "wineryId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Wine_wineryId_idx" ON "Wine"("wineryId");

-- AddForeignKey
ALTER TABLE "Wine" ADD CONSTRAINT "Wine_wineryId_fkey" FOREIGN KEY ("wineryId") REFERENCES "Winery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

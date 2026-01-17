-- DropForeignKey
ALTER TABLE "Wine" DROP CONSTRAINT "Wine_wineryId_fkey";

-- AlterTable
ALTER TABLE "Wine" ALTER COLUMN "wineryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Wine" ADD CONSTRAINT "Wine_wineryId_fkey" FOREIGN KEY ("wineryId") REFERENCES "Winery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

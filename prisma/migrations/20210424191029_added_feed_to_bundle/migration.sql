-- AlterTable
ALTER TABLE "Feed" ADD COLUMN     "bundleId" TEXT;

-- AddForeignKey
ALTER TABLE "Feed" ADD FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

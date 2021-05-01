/*
  Warnings:

  - You are about to drop the `_BundleToFeed` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BundleToFeed" DROP CONSTRAINT "_BundleToFeed_A_fkey";

-- DropForeignKey
ALTER TABLE "_BundleToFeed" DROP CONSTRAINT "_BundleToFeed_B_fkey";

-- DropTable
DROP TABLE "_BundleToFeed";

-- DropForeignKey
ALTER TABLE "productos" DROP CONSTRAINT "productos_sellerId_fkey";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "RFC" TEXT;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - The primary key for the `Campaign` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CustomerCampaign` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CustomerTopic` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Topic` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `CampaignTopic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CampaignTopic" DROP CONSTRAINT "CampaignTopic_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "CampaignTopic" DROP CONSTRAINT "CampaignTopic_topicId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerCampaign" DROP CONSTRAINT "CustomerCampaign_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerCampaign" DROP CONSTRAINT "CustomerCampaign_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerTopic" DROP CONSTRAINT "CustomerTopic_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerTopic" DROP CONSTRAINT "CustomerTopic_topicId_fkey";

-- AlterTable
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Campaign_id_seq";

-- AlterTable
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Customer_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Customer_id_seq";

-- AlterTable
ALTER TABLE "CustomerCampaign" DROP CONSTRAINT "CustomerCampaign_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "customerId" SET DATA TYPE TEXT,
ALTER COLUMN "campaignId" SET DATA TYPE TEXT,
ADD CONSTRAINT "CustomerCampaign_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CustomerCampaign_id_seq";

-- AlterTable
ALTER TABLE "CustomerTopic" DROP CONSTRAINT "CustomerTopic_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "customerId" SET DATA TYPE TEXT,
ALTER COLUMN "topicId" SET DATA TYPE TEXT,
ADD CONSTRAINT "CustomerTopic_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CustomerTopic_id_seq";

-- AlterTable
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Topic_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Topic_id_seq";

-- DropTable
DROP TABLE "CampaignTopic";

-- AddForeignKey
ALTER TABLE "CustomerCampaign" ADD CONSTRAINT "CustomerCampaign_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerCampaign" ADD CONSTRAINT "CustomerCampaign_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerTopic" ADD CONSTRAINT "CustomerTopic_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerTopic" ADD CONSTRAINT "CustomerTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `password` to the `create_seller` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "create_seller" ADD COLUMN     "password" TEXT NOT NULL;

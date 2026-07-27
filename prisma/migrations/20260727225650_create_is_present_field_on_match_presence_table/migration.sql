/*
  Warnings:

  - You are about to drop the column `updated_at` on the `group_invites` table. All the data in the column will be lost.
  - Added the required column `is_present` to the `group_match_presences` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "group_invites" DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "group_match_presences" ADD COLUMN     "is_present" BOOLEAN NOT NULL;

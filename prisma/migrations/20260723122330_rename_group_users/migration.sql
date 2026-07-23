/*
  Warnings:

  - You are about to drop the `group_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "group_users" DROP CONSTRAINT "group_users_group_id_fkey";

-- DropForeignKey
ALTER TABLE "group_users" DROP CONSTRAINT "group_users_guest_user_id_fkey";

-- DropForeignKey
ALTER TABLE "group_users" DROP CONSTRAINT "group_users_user_id_fkey";

-- DropTable
DROP TABLE "group_users";

-- CreateTable
CREATE TABLE "groups_users" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "user_id" TEXT,
    "rank" "Rank",
    "type" "GroupUserType" NOT NULL,
    "guest_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "groups_users_group_id_user_id_key" ON "groups_users"("group_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "groups_users_group_id_guest_user_id_key" ON "groups_users"("group_id", "guest_user_id");

-- AddForeignKey
ALTER TABLE "groups_users" ADD CONSTRAINT "groups_users_guest_user_id_fkey" FOREIGN KEY ("guest_user_id") REFERENCES "GuestUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups_users" ADD CONSTRAINT "groups_users_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups_users" ADD CONSTRAINT "groups_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

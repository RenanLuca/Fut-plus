-- AlterTable
ALTER TABLE "match_team_players" ADD COLUMN "group_match_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "match_team_players_group_match_id_user_id_key" ON "match_team_players"("group_match_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "match_team_players_group_match_id_guest_user_id_key" ON "match_team_players"("group_match_id", "guest_user_id");

-- AddForeignKey
ALTER TABLE "match_team_players" ADD CONSTRAINT "match_team_players_group_match_id_fkey" FOREIGN KEY ("group_match_id") REFERENCES "group_matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

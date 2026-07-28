-- CreateIndex
CREATE UNIQUE INDEX "group_matches_group_id_match_date_key" ON "group_matches"("group_id", "match_date");

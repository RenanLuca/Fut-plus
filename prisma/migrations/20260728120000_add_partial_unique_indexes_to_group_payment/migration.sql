-- AlterTable: add the optional link to a specific match (avulso/DAILY/GUEST payments)
ALTER TABLE "group_payments" ADD COLUMN "match_id" TEXT;

-- AlterTable: period is a month-bucket, not a timestamp -- drop the time component
ALTER TABLE "group_payments" ALTER COLUMN "period" TYPE DATE USING ("period"::date);

-- AddForeignKey
ALTER TABLE "group_payments" ADD CONSTRAINT "group_payments_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "group_matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Partial unique indexes: Prisma's `@@unique` can't express conditional
-- uniqueness, so these are hand-written.
--
-- Monthly payments (match_id IS NULL): at most one payment per
-- group+user+period (the whole month is covered by a single flat fee).
CREATE UNIQUE INDEX "group_payments_monthly_unique" ON "group_payments"("group_id", "user_id", "period") WHERE "match_id" IS NULL;

-- Per-match payments (match_id IS NOT NULL): at most one payment per
-- group+user+match (a DAILY/GUEST member can owe once per match they play).
CREATE UNIQUE INDEX "group_payments_daily_unique" ON "group_payments"("group_id", "user_id", "match_id") WHERE "match_id" IS NOT NULL;

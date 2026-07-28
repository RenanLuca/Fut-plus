import { Module } from "@nestjs/common";
import { GroupPaymentsService } from "./group-payments.service";
import { GroupPaymentsController } from "./group-payments.controller";
import { GroupsModule } from "../groups/groups.module";
import { GroupMatchesModule } from "../group-matches/group-matches.module";
import { MatchPresencesModule } from "../match-presences/match-presences.module";

@Module({
  imports: [
    GroupsModule,
    GroupMatchesModule,
    MatchPresencesModule,
  ],
  controllers: [GroupPaymentsController],
  providers: [GroupPaymentsService],
})
export class GroupPaymentsModule {}

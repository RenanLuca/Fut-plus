import { Module } from "@nestjs/common";
import { MatchTeamsService } from "./match-teams.service";
import { MatchTeamsController } from "./match-teams.controller";
import { GroupMatchesModule } from "../group-matches/group-matches.module";
import { GroupsModule } from "../groups/groups.module";

@Module({
  imports: [GroupMatchesModule, GroupsModule],
  controllers: [MatchTeamsController],
  providers: [MatchTeamsService],
})
export class MatchTeamsModule {}

import { Module } from "@nestjs/common";
import { MatchPresencesService } from "./match-presences.service";
import { MatchPresencesController } from "./match-presences.controller";
import { GroupMatchesModule } from "../group-matches/group-matches.module";
import { GroupsModule } from "../groups/groups.module";

@Module({
  imports: [GroupMatchesModule, GroupsModule],
  controllers: [MatchPresencesController],
  providers: [MatchPresencesService],
})
export class MatchPresencesModule {}

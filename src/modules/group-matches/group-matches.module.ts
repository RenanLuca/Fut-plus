import { Module } from "@nestjs/common";
import { GroupMatchesService } from "./services/group-matches.service";
import { GroupMatchesController } from "./group-matches.controller";
import { GroupsModule } from "../groups/groups.module";
import { GroupMatchesSchedulerService } from "./services/group-matches-scheduler.service";

@Module({
  imports: [GroupsModule],
  controllers: [GroupMatchesController],
  providers: [GroupMatchesService, GroupMatchesSchedulerService],
  exports: [GroupMatchesService],
})
export class GroupMatchesModule {}

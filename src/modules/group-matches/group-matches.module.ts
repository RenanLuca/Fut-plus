import { Module } from "@nestjs/common";
import { GroupMatchesService } from "./group-matches.service";
import { GroupMatchesController } from "./group-matches.controller";
import { GroupsModule } from "../groups/groups.module";

@Module({
  imports: [GroupsModule],
  controllers: [GroupMatchesController],
  providers: [GroupMatchesService],
})
export class GroupMatchesModule {}

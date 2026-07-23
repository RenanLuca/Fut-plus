import { Module } from "@nestjs/common";
import { GroupsService } from "./groups.service";
import { GroupsController } from "./groups.controller";
import { UserBelongsToGroupService } from "./services/userBelongsToGroup.service";

@Module({
  controllers: [GroupsController],
  providers: [GroupsService, UserBelongsToGroupService],
})
export class GroupsModule {}

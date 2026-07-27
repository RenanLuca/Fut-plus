import { Module } from "@nestjs/common";
import { GuestUsersService } from "./guest-users.service";
import { GuestUsersController } from "./guest-users.controller";
import { UserBelongsToGroupService } from "../groups/services/userBelongsToGroup.service";
import { GroupsModule } from "../groups/groups.module";

@Module({
  imports: [GroupsModule],
  controllers: [GuestUsersController],
  providers: [GuestUsersService],
})
export class GuestUsersModule {}

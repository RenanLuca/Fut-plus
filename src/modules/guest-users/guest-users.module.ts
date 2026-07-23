import { Module } from "@nestjs/common";
import { GuestUsersService } from "./guest-users.service";
import { GuestUsersController } from "./guest-users.controller";
import { UserBelongsToGroupService } from "../groups/services/userBelongsToGroup.service";

@Module({
  controllers: [GuestUsersController],
  providers: [GuestUsersService, UserBelongsToGroupService],
})
export class GuestUsersModule {}

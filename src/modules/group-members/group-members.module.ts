import { Module } from "@nestjs/common";
import { GroupMembersService } from "./group-members.service";
import { GroupMembersController } from "./group-members.controller";
import { GroupsModule } from "../groups/groups.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [GroupsModule, UsersModule],
  controllers: [GroupMembersController],
  providers: [GroupMembersService],
})
export class GroupMembersModule {}

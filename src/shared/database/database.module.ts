import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { UsersRepository } from "./repositories/users.repository";
import { GuestUsersRepository } from "./repositories/guest-users-repository";
import { GroupMembersRepository } from "./repositories/group-members-repository";
import { GroupsRepository } from "./repositories/groups-repository";

@Global()
@Module({
  providers: [
    PrismaService,
    UsersRepository,
    GuestUsersRepository,
    GroupMembersRepository,
    GroupsRepository,
  ],
  exports: [
    UsersRepository,
    GuestUsersRepository,
    GroupMembersRepository,
    GroupsRepository,
  ],
})
export class DatabaseModule {}

import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { UsersRepository } from "./repositories/users.repository";
import { GuestUsersRepository } from "./repositories/guest-users-repository";
import { GroupsUsersRepository } from "./repositories/groups-users-repository";
import { GroupsRepository } from "./repositories/groups-repository";

@Global()
@Module({
  providers: [
    PrismaService,
    UsersRepository,
    GuestUsersRepository,
    GroupsUsersRepository,
    GroupsRepository,
  ],
  exports: [
    UsersRepository,
    GuestUsersRepository,
    GroupsUsersRepository,
    GroupsRepository,
  ],
})
export class DatabaseModule {}

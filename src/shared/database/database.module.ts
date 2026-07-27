import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { UsersRepository } from "./repositories/users.repository";
import { GuestUsersRepository } from "./repositories/guest-users.repository";
import { GroupMembersRepository } from "./repositories/group-members.repository";
import { GroupsRepository } from "./repositories/groups.repository";
import { GroupMatchesRepository } from "./repositories/group-matches.repository";
import { MatchPresencesRepository } from "./repositories/match-presences.repository";

@Global()
@Module({
  providers: [
    PrismaService,
    UsersRepository,
    GuestUsersRepository,
    GroupMembersRepository,
    GroupsRepository,
    GroupMatchesRepository,
    MatchPresencesRepository,
  ],
  exports: [
    UsersRepository,
    GuestUsersRepository,
    GroupMembersRepository,
    GroupsRepository,
    GroupMatchesRepository,
    MatchPresencesRepository,
  ],
})
export class DatabaseModule {}

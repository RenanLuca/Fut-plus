import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { UsersRepository } from "./repositories/users.repository";
import { GuestUsersRepository } from "./repositories/guest-users-repository";

@Global()
@Module({
  providers: [PrismaService, UsersRepository, GuestUsersRepository],
  exports: [UsersRepository, GuestUsersRepository],
})
export class DatabaseModule {}

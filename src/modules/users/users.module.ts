import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { UsersRepository } from "@src/shared/database/repositories/users.repository";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

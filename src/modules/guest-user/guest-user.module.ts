import { Module } from '@nestjs/common';
import { GuestUserService } from './guest-user.service';
import { GuestUserController } from './guest-user.controller';

@Module({
  controllers: [GuestUserController],
  providers: [GuestUserService],
})
export class GuestUserModule {}

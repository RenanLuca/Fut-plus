import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { DatabaseModule } from "./shared/database/database.module";
import { AuthGuard } from "./modules/auth/auth.guard";
import { APP_GUARD } from "@nestjs/core";
import { UsersModule } from './modules/users/users.module';
import { GuestUserModule } from './modules/guest-user/guest-user.module';
import { GuestUserModule } from './modules/guest-user/guest-user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    GuestUserModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}

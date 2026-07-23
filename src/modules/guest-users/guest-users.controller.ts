import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from "@nestjs/common";
import { GuestUsersService } from "./guest-users.service";
import { CreateGuestUserDto } from "./dto/create-guest-user.dto";
import { ActiveUserId } from "@src/shared/decorators/ActiveUserId";

@Controller("groups/:groupId/guest-users")
export class GuestUsersController {
  constructor(
    private readonly guestUsersService: GuestUsersService,
  ) {}

  @Post()
  create(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @Body() createGuestUserDto: CreateGuestUserDto,
    @ActiveUserId() userId: string,
  ) {
    return this.guestUsersService.create(
      createGuestUserDto,
      groupId,
      userId,
    );
  }

  @Get(":guestUserId")
  findOne(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @Param("guestUserId", ParseUUIDPipe) guestUserId: string,
    @ActiveUserId() userId: string,
  ) {
    return this.guestUsersService.findOne(
      userId,
      guestUserId,
      groupId,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":guestUserId")
  remove(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @Param("guestUserId", ParseUUIDPipe) guestUserId: string,
    @ActiveUserId() userId: string,
  ) {
    return this.guestUsersService.remove(
      userId,
      guestUserId,
      groupId,
    );
  }
}

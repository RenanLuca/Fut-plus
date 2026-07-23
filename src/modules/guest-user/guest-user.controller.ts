import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { GuestUserService } from "./guest-user.service";
import { CreateGuestUserDto } from "./dto/create-guest-user.dto";

@Controller("guest-user")
export class GuestUserController {
  constructor(private readonly guestUserService: GuestUserService) {}

  @Post()
  create(@Body() createGuestUserDto: CreateGuestUserDto) {
    return this.guestUserService.createGuestUserAndConnectToGroup(
      createGuestUserDto,
    );
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.guestUserService.findOne(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.guestUserService.remove(id);
  }
}

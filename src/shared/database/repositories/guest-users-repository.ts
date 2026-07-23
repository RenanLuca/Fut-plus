import { Injectable } from "@nestjs/common";
import { Prisma } from "../../../../generated/prisma/client";
import { PrismaService } from "../prisma.service";

@Injectable()
export class GuestUsersRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(createGuestUserDto: Prisma.GuestUserCreateArgs) {
    return this.prisma.guestUser.create(createGuestUserDto);
  }
  async findUnique(findUniqueGuestUserDto: Prisma.GuestUserFindUniqueArgs) {
    return this.prisma.guestUser.findUnique(findUniqueGuestUserDto);
  }
  async findFirst(findFirstGuestUserDto: Prisma.GuestUserFindFirstArgs) {
    return this.prisma.guestUser.findFirst(findFirstGuestUserDto);
  }

  async delete(deleteGuestUserDto: Prisma.GuestUserDeleteArgs) {
    return this.prisma.guestUser.delete(deleteGuestUserDto);
  }
}

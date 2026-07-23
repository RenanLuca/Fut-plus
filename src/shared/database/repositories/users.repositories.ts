import { Injectable } from "@nestjs/common";
import { Prisma } from "../../../../generated/prisma/client";
import { PrismaService } from "../prisma.service";

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: Prisma.UserCreateArgs) {
    return this.prisma.user.create(createUserDto);
  }
  async findUnique(findUniqueUserDto: Prisma.UserFindUniqueArgs) {
    return this.prisma.user.findUnique(findUniqueUserDto);
  }
}

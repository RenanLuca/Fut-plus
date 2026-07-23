import { Injectable } from "@nestjs/common";
import { Prisma } from "../../../../generated/prisma/client";
import { PrismaService } from "../prisma.service";

@Injectable()
export class GroupsUsersRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(createGroupUserDto: Prisma.GroupUserCreateArgs) {
    return this.prisma.groupUser.create(createGroupUserDto);
  }
  async findUnique(findUniqueGroupUserDto: Prisma.GroupUserFindUniqueArgs) {
    return this.prisma.groupUser.findUnique(findUniqueGroupUserDto);
  }
  async findFirst(findFirstGroupUserDto: Prisma.GroupUserFindFirstArgs) {
    return this.prisma.groupUser.findFirst(findFirstGroupUserDto);
  }

  async delete(deleteGroupUserDto: Prisma.GroupUserDeleteArgs) {
    return this.prisma.groupUser.delete(deleteGroupUserDto);
  }
}

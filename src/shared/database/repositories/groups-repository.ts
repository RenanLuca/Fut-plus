import { Injectable } from "@nestjs/common";
import { Prisma } from "../../../../generated/prisma/client";
import { PrismaService } from "../prisma.service";

@Injectable()
export class GroupsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(createGroupDto: Prisma.GroupCreateArgs) {
    return this.prisma.group.create(createGroupDto);
  }
  async findUnique(findUniqueGroupDto: Prisma.GroupFindUniqueArgs) {
    return this.prisma.group.findUnique(findUniqueGroupDto);
  }
  async findFirst(findFirstGroupDto: Prisma.GroupFindFirstArgs) {
    return this.prisma.group.findFirst(findFirstGroupDto);
  }

  async delete(deleteGroupDto: Prisma.GroupDeleteArgs) {
    return this.prisma.group.delete(deleteGroupDto);
  }
}

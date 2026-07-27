import { Injectable } from "@nestjs/common";
import { Prisma } from "../../../../generated/prisma/client";
import { PrismaService } from "../prisma.service";

@Injectable()
export class GroupMatchesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createGroupMatchDto: Prisma.GroupMatchCreateArgs,
  ) {
    return this.prisma.groupMatch.create(createGroupMatchDto);
  }

  async findOne(
    findGroupMatchDto: Prisma.GroupMatchFindFirstArgs,
  ) {
    return this.prisma.groupMatch.findFirst(findGroupMatchDto);
  }

  async findMany(
    findGroupMatchesDto: Prisma.GroupMatchFindManyArgs,
  ) {
    return this.prisma.groupMatch.findMany(findGroupMatchesDto);
  }

  async delete(deleteGroupMatchDto: Prisma.GroupMatchDeleteArgs) {
    return this.prisma.groupMatch.delete(deleteGroupMatchDto);
  }
}

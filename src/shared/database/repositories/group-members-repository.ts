import { Injectable } from "@nestjs/common";
import { Prisma } from "../../../../generated/prisma/client";
import { PrismaService } from "../prisma.service";

@Injectable()
export class GroupMembersRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(createGroupMemberDto: Prisma.GroupMemberCreateArgs) {
    return this.prisma.groupMember.create(createGroupMemberDto);
  }
  async findUnique(findUniqueGroupMemberDto: Prisma.GroupMemberFindUniqueArgs) {
    return this.prisma.groupMember.findUnique(findUniqueGroupMemberDto);
  }
  async findFirst(findFirstGroupMemberDto: Prisma.GroupMemberFindFirstArgs) {
    return this.prisma.groupMember.findFirst(findFirstGroupMemberDto);
  }

  async delete(deleteGroupMemberDto: Prisma.GroupMemberDeleteArgs) {
    return this.prisma.groupMember.delete(deleteGroupMemberDto);
  }
}

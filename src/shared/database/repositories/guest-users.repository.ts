import { Injectable } from "@nestjs/common";
import {
  GroupMemberType,
  Prisma,
  Rank,
} from "../../../../generated/prisma/client";
import { PrismaService } from "../prisma.service";

@Injectable()
export class GuestUsersRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(createGuestUserDto: Prisma.GuestUserCreateArgs) {
    return this.prisma.guestUser.create(createGuestUserDto);
  }
  async createAndConnectToGroup(
    createGuestUserDto: Prisma.GuestUserUncheckedCreateInput,
    groupId: string,
    rank?: Rank,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const guestUser = await tx.guestUser.create({
        data: createGuestUserDto,
      });
      await tx.groupMember.create({
        data: {
          guestUserId: guestUser.id,
          groupId,
          rank,
          type: GroupMemberType.GUEST,
        },
      });

      return { ...guestUser, groupId, rank };
    });
  }
  async findUnique(
    findUniqueGuestUserDto: Prisma.GuestUserFindUniqueArgs,
  ) {
    return this.prisma.guestUser.findUnique(
      findUniqueGuestUserDto,
    );
  }
  async findFirst(
    findFirstGuestUserDto: Prisma.GuestUserFindFirstArgs,
  ) {
    return this.prisma.guestUser.findFirst(
      findFirstGuestUserDto,
    );
  }

  async delete(deleteGuestUserDto: Prisma.GuestUserDeleteArgs) {
    return this.prisma.guestUser.delete(deleteGuestUserDto);
  }
}
